import type { VercelRequest, VercelResponse } from '@vercel/node'
import { waitUntil } from '@vercel/functions'
import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import type { Answers } from '@dupply/types/diagnostico'
import { generateAnthropicReport } from './lib/anthropic'
import { checkDiagnosticoRateLimit } from './lib/rateLimit'
import { scheduleDiagnosticoEmails } from './lib/scheduleDiagnosticoEmails'
import { resolveDiagnosticoReports } from './lib/splitReport'
import { verifyTurnstileToken } from './lib/turnstile'

function isAnswers(value: unknown): value is Answers {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim()
  return 'unknown'
}

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const clientIp = getClientIp(req)

  try {
    const rate = await checkDiagnosticoRateLimit(clientIp)
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.resetInSec))
      return res.status(429).json({
        error: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
        retryAfterSec: rate.resetInSec,
      })
    }
  } catch (error) {
    console.error('[diagnostico] Rate limit:', error instanceof Error ? error.message : error)
  }

  const { answers, turnstileToken, website, testMode } = (req.body ?? {}) as {
    answers?: unknown
    turnstileToken?: string
    website?: string
    testMode?: boolean
  }

  if (website?.trim()) {
    return res.status(400).json({ error: 'Requisição inválida' })
  }

  const turnstile = await verifyTurnstileToken(turnstileToken, clientIp)
  if (!turnstile.ok) {
    return res.status(403).json({ error: 'Verificação de segurança falhou. Recarregue e tente novamente.' })
  }

  if (!isAnswers(answers)) {
    return res.status(400).json({ error: 'Respostas inválidas' })
  }

  if (!String(answers.nome ?? '').trim()) {
    return res.status(400).json({ error: 'Nome da empresa é obrigatório' })
  }

  const isTestRun =
    testMode === true && String(answers.nome ?? '').trim().toUpperCase().startsWith('TC_')

  if (testMode === true && !isTestRun) {
    return res.status(400).json({ error: 'Modo teste exige nome com prefixo TC_' })
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
        console.error('[diagnostico] Google Sheets:', error instanceof Error ? error.message : error)
        await enqueueSheetRetry(sheetPayload, error instanceof Error ? error.message : 'Erro')
      }),
    )
  }

  waitUntil(
    import('./lib/saveDiagnostico')
      .then(({ saveDiagnosticoToDb }) =>
        saveDiagnosticoToDb({
          answers,
          score,
          scoreLabel: scoreInfo.label,
          reportClientHtml: reports.clientHtml,
          reportInternalHtml: reports.internalHtml,
          aiGenerated,
        }),
      )
      .catch((error) => {
        console.error('[diagnostico] Postgres:', error instanceof Error ? error.message : error)
      }),
  )

  const { emailDispatched, emailTo } = scheduleDiagnosticoEmails(waitUntil, {
    answers,
    reportClientHtml: reports.clientHtml,
    score,
    scoreLabel: scoreInfo.label,
    aiGenerated,
  })

  return res.status(200).json({
    reportHtml: reports.clientHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    dbPending: true,
    sheetPending: sheetsEnabled,
    emailDispatched,
    emailTo,
  })
}

export default handler
