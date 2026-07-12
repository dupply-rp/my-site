import { waitUntil } from '@vercel/functions'
import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import type { Answers } from '@dupply/types/diagnostico'
import { generateAnthropicReport } from './lib/anthropic'
import { checkDiagnosticoRateLimit, getClientIp } from './lib/rateLimit'
import { scheduleDiagnosticoEmails } from './lib/scheduleDiagnosticoEmails'
import { resolveDiagnosticoReports } from './lib/splitReport'
import { verifyTurnstileToken } from './lib/turnstile'

export const config = {
  runtime: 'edge',
}

function isAnswers(value: unknown): value is Answers {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function jsonResponse(body: unknown, status = 200, headers?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })
}

export default handleDiagnostico

async function handleDiagnostico(request: Request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  const clientIp = getClientIp(request)

  try {
    const rate = await checkDiagnosticoRateLimit(clientIp)
    if (!rate.allowed) {
      return jsonResponse(
        {
          error: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
          retryAfterSec: rate.resetInSec,
        },
        429,
        {
          'Retry-After': String(rate.resetInSec),
          'X-RateLimit-Limit': String(rate.limit),
          'X-RateLimit-Remaining': String(rate.remaining),
        },
      )
    }
  } catch (error) {
    console.error('[diagnostico] Rate limit:', error instanceof Error ? error.message : error)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'JSON inválido' }, 400)
  }

  const { answers, turnstileToken, website, testMode } = (body ?? {}) as {
    answers?: unknown
    turnstileToken?: string
    website?: string
    testMode?: boolean
  }

  if (website?.trim()) {
    return jsonResponse({ error: 'Requisição inválida' }, 400)
  }

  const turnstile = await verifyTurnstileToken(turnstileToken, clientIp)
  if (!turnstile.ok) {
    return jsonResponse({ error: 'Verificação de segurança falhou. Recarregue e tente novamente.' }, 403)
  }

  if (!isAnswers(answers)) {
    return jsonResponse({ error: 'Respostas inválidas' }, 400)
  }

  if (!String(answers.nome ?? '').trim()) {
    return jsonResponse({ error: 'Nome da empresa é obrigatório' }, 400)
  }

  const isTestRun =
    testMode === true && String(answers.nome ?? '').trim().toUpperCase().startsWith('TC_')

  if (testMode === true && !isTestRun) {
    return jsonResponse({ error: 'Modo teste exige nome com prefixo TC_' }, 400)
  }

  const summary = buildSummary(answers, { mode: 'api' })
  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)
  const pillars = calcPillars(answers)

  let rawReportHtml: string
  let aiGenerated = false

  try {
    rawReportHtml = await generateAnthropicReport(summary, {
      score,
      scoreLabel: scoreInfo.label,
    })
    aiGenerated = true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar relatório'
    console.error('[diagnostico] Anthropic:', message)
    rawReportHtml = buildFallbackReport(answers, scoreInfo)
  }

  const reports = resolveDiagnosticoReports(rawReportHtml, { aiGenerated, answers, scoreInfo })

  const sheetsEnabled = process.env.ENABLE_GOOGLE_SHEETS === 'true'

  let diagnosticoId: string | null = null
  try {
    const { saveDiagnosticoToDb } = await import('./lib/saveDiagnostico')
    diagnosticoId = await saveDiagnosticoToDb({
      answers,
      score,
      scoreLabel: scoreInfo.label,
      reportClientHtml: reports.clientHtml,
      reportInternalHtml: reports.internalHtml,
      aiGenerated,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao salvar no banco'
    console.error('[diagnostico] Postgres:', message)
  }

  if (sheetsEnabled) {
    const { saveToGoogleSheets } = await import('./lib/googleSheets')
    const { enqueueSheetRetry } = await import('./lib/retryQueue')
    const { buildSheetPayload } = await import('./lib/sheetPayload')

    const sheetPayload = buildSheetPayload({
      answers,
      score,
      scoreLabel: scoreInfo.label,
      reportHtml: reports.fullHtml,
    })

    waitUntil(
      saveToGoogleSheets({
        answers,
        score,
        scoreLabel: scoreInfo.label,
        reportHtml: reports.fullHtml,
      }).catch(async (error) => {
        const message = error instanceof Error ? error.message : 'Erro ao salvar na planilha'
        console.error('[diagnostico] Google Sheets:', message)
        await enqueueSheetRetry(sheetPayload, message)
      }),
    )
  }

  const { emailDispatched, emailTo } = scheduleDiagnosticoEmails(waitUntil, {
    answers,
    reportClientHtml: reports.clientHtml,
    score,
    scoreLabel: scoreInfo.label,
    aiGenerated,
    diagnosticoId,
  })

  return jsonResponse({
    reportHtml: reports.clientHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    dbPending: !diagnosticoId,
    diagnosticoId,
    sheetPending: sheetsEnabled,
    emailDispatched,
    emailTo,
  })
}
