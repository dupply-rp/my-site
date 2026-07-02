import { waitUntil } from '@vercel/functions'
import { buildSummary } from '../server/lib/diagnostico/buildSummary.js'
import { buildFallbackReport } from '../server/lib/diagnostico/fallbackReport.js'
import { calcPillars, calcScore, getScoreInfo } from '../server/lib/diagnostico/scoring.js'
import type { Answers } from '../server/lib/diagnostico/types.js'
import { generateAnthropicReport } from '../server/lib/anthropic.js'
import { saveToGoogleSheets } from '../server/lib/googleSheets.js'
import { enqueueSheetRetry } from '../server/lib/retryQueue.js'
import { buildSheetPayload } from '../server/lib/sheetPayload.js'
import { checkDiagnosticoRateLimit, getClientIp } from '../server/lib/rateLimit.js'
import { canSendReportEmail, sendReportEmail } from '../server/lib/sendReportEmail.js'
import { verifyTurnstileToken } from '../server/lib/turnstile.js'

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

export default async function handler(request: Request) {
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

  const { answers, turnstileToken, website } = (body ?? {}) as {
    answers?: unknown
    turnstileToken?: string
    website?: string
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

  const summary = buildSummary(answers)
  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)
  const pillars = calcPillars(answers)

  let reportHtml: string
  let aiGenerated = false

  try {
    reportHtml = await generateAnthropicReport(summary, {
      score,
      scoreLabel: scoreInfo.label,
    })
    aiGenerated = true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar relatório'
    console.error('[diagnostico] Anthropic:', message)
    reportHtml = buildFallbackReport(answers, scoreInfo)
  }

  const sheetPayload = buildSheetPayload({
    answers,
    score,
    scoreLabel: scoreInfo.label,
    reportHtml,
  })

  waitUntil(
    saveToGoogleSheets({ answers, score, scoreLabel: scoreInfo.label, reportHtml }).catch(
      async (error) => {
        const message = error instanceof Error ? error.message : 'Erro ao salvar na planilha'
        console.error('[diagnostico] Google Sheets:', message)
        await enqueueSheetRetry(sheetPayload, message)
      },
    ),
  )

  const recipientEmail = String(answers.email ?? '').trim()
  const emailDispatched = canSendReportEmail(recipientEmail)

  if (emailDispatched) {
    waitUntil(
      sendReportEmail({
        to: recipientEmail,
        companyName: String(answers.nome ?? 'Sua empresa'),
        score,
        scoreLabel: scoreInfo.label,
        reportHtml,
        aiGenerated,
      }).catch((error) => {
        const message = error instanceof Error ? error.message : 'Erro ao enviar e-mail'
        console.error('[diagnostico] E-mail:', message)
      }),
    )
  }

  return jsonResponse({
    reportHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    sheetPending: true,
    emailDispatched,
    emailTo: emailDispatched ? recipientEmail : undefined,
  })
}
