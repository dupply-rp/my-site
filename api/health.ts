import type { VercelRequest, VercelResponse } from '@vercel/node'
import { waitUntil } from '@vercel/functions'
import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import type { Answers } from '@dupply/types/diagnostico'
import { generateAnthropicReport } from '@dupply/api/lib/anthropic'
import { checkDiagnosticoRateLimit } from '@dupply/api/lib/rateLimit'
import { canSendReportEmail, sendReportEmail } from '@dupply/api/lib/sendReportEmail'
import { verifyTurnstileToken } from '@dupply/api/lib/turnstile'

export const config = {
  maxDuration: 60,
}

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'dupply-diagnostico' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const clientIp = getClientIp(req)

  try {
    const rate = await checkDiagnosticoRateLimit(clientIp)
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.resetInSec))
      res.setHeader('X-RateLimit-Limit', String(rate.limit))
      res.setHeader('X-RateLimit-Remaining', String(rate.remaining))
      return res.status(429).json({
        error: 'Muitas tentativas. Aguarde um pouco e tente novamente.',
        retryAfterSec: rate.resetInSec,
      })
    }
  } catch (error) {
    console.error('[diagnostico] Rate limit:', error instanceof Error ? error.message : error)
  }

  const { answers, turnstileToken, website } = (req.body ?? {}) as {
    answers?: unknown
    turnstileToken?: string
    website?: string
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

  const summary = buildSummary(answers, { mode: 'api' })
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

  const sheetsEnabled = process.env.ENABLE_GOOGLE_SHEETS === 'true'

  if (sheetsEnabled) {
    const { saveToGoogleSheets } = await import('@dupply/api/lib/googleSheets')
    const { enqueueSheetRetry } = await import('@dupply/api/lib/retryQueue')
    const { buildSheetPayload } = await import('@dupply/api/lib/sheetPayload')

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
  }

  waitUntil(
    import('@dupply/api/lib/saveDiagnostico')
      .then(({ saveDiagnosticoToDb }) =>
        saveDiagnosticoToDb({
          answers,
          score,
          scoreLabel: scoreInfo.label,
          reportHtml,
          aiGenerated,
        }),
      )
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Erro ao salvar no banco'
        console.error('[diagnostico] Postgres:', message)
      }),
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

  return res.status(200).json({
    reportHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    dbPending: true,
    sheetPending: sheetsEnabled,
    emailDispatched,
    emailTo: emailDispatched ? recipientEmail : undefined,
  })
}
