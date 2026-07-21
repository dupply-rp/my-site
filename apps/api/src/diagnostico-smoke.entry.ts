import type { VercelRequest, VercelResponse } from '@vercel/node'
import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import { generateAnthropicReport } from './lib/anthropic'
import { saveToGoogleSheets } from './lib/googleSheets'
import { isRetryQueueEnabled, enqueueSheetRetry } from './lib/retryQueue'
import { createSmokeAnswers } from './lib/smokeFixture'
import { buildSheetPayload } from './lib/sheetPayload'
import { resolveDiagnosticoReports } from './lib/splitReport'
import { sendLeadNotificationEmail, sendReportEmail } from './lib/sendReportEmail'

function isAuthorized(req: VercelRequest): boolean {
  const secret = process.env.DIAGNOSTICO_TEST_SECRET?.trim()
  if (!secret) return false

  const authHeader = req.headers.authorization?.trim()
  if (authHeader === `Bearer ${secret}`) return true

  const querySecret = typeof req.query.secret === 'string' ? req.query.secret.trim() : undefined
  return querySecret === secret
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const serverSecret = process.env.DIAGNOSTICO_TEST_SECRET?.trim()
  if (!serverSecret) {
    return res.status(503).json({
      error: 'DIAGNOSTICO_TEST_SECRET não configurado em Production na Vercel',
    })
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ error: 'Token inválido — confira se o valor é igual ao da Vercel (Production)' })
  }

  const mode = typeof req.query.mode === 'string' ? req.query.mode : 'full'

  const answers = createSmokeAnswers()
  const summary = buildSummary(answers, { mode: 'api' })
  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)
  const pillars = calcPillars(answers)

  const checks: Record<string, unknown> = {
    mode,
    timestamp: new Date().toISOString(),
    retryQueueEnabled: isRetryQueueEnabled(),
    env: {
      anthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
      sheetsWebhook: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
      upstash: isRetryQueueEnabled(),
    },
  }

  if (mode === 'email') {
    const recipient = typeof req.query.email === 'string' ? req.query.email.trim() : ''
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!recipient || !emailPattern.test(recipient)) {
      return res.status(400).json({ error: 'Informe ?email=destinatario@dominio.com' })
    }

    answers.nome = `TC_Email Test ${new Date().toISOString().replace(/[:.]/g, '-')}`
    answers.email = recipient

    const reportHtml = buildFallbackReport(answers, scoreInfo)
    const reports = resolveDiagnosticoReports(reportHtml, { aiGenerated: false, answers, scoreInfo })

    let clientSent = false
    let clientError: string | undefined
    let notifySent = false
    let notifyError: string | undefined

    try {
      await sendLeadNotificationEmail({
        answers,
        score,
        scoreLabel: scoreInfo.label,
        aiGenerated: false,
      })
      notifySent = true
    } catch (error) {
      notifyError = error instanceof Error ? error.message : 'Erro ao notificar equipe'
    }

    try {
      await sendReportEmail({
        to: recipient,
        companyName: String(answers.nome),
        score,
        scoreLabel: scoreInfo.label,
        reportHtml: reports.clientHtml,
        aiGenerated: false,
      })
      clientSent = true
    } catch (error) {
      clientError = error instanceof Error ? error.message : 'Erro ao enviar e-mail cliente'
    }

    return res.status(200).json({
      ok: clientSent,
      checks: {
        ...checks,
        resendConfigured: Boolean(process.env.RESEND_API_KEY?.trim() && process.env.REPORT_EMAIL_FROM?.trim()),
        clientSent,
        clientError,
        notifySent,
        notifyError,
      },
      sample: { empresa: answers.nome, email: recipient, score, scoreLabel: scoreInfo.label },
    })
  }

  if (mode === 'sheets') {
    let sheetSaved = false
    let sheetError: string | undefined
    let queued = false

    try {
      await saveToGoogleSheets({
        answers,
        score,
        scoreLabel: scoreInfo.label,
        reportHtml: '<p>Smoke test — somente planilha</p>',
      })
      sheetSaved = true
    } catch (error) {
      sheetError = error instanceof Error ? error.message : 'Erro ao salvar'
      queued = await enqueueSheetRetry(
        buildSheetPayload({
          answers,
          score,
          scoreLabel: scoreInfo.label,
          reportHtml: '<p>Smoke test — somente planilha</p>',
        }),
        sheetError,
      )
    }

    return res.status(200).json({
      ok: sheetSaved || queued,
      checks: { ...checks, sheetSaved, sheetError, queued },
      sample: { empresa: answers.nome, email: answers.email, score },
    })
  }

  let reportHtml: string
  let aiGenerated = false
  let aiError: string | undefined

  if (mode === 'full') {
    try {
      reportHtml = await generateAnthropicReport(summary)
      aiGenerated = true
    } catch (error) {
      aiError = error instanceof Error ? error.message : 'Erro Anthropic'
      reportHtml = buildFallbackReport(answers, scoreInfo)
    }
  } else {
    reportHtml = buildFallbackReport(answers, scoreInfo)
  }

  let sheetSaved = false
  let sheetError: string | undefined
  let queued = false

  try {
    await saveToGoogleSheets({ answers, score, scoreLabel: scoreInfo.label, reportHtml })
    sheetSaved = true
  } catch (error) {
    sheetError = error instanceof Error ? error.message : 'Erro ao salvar'
    queued = await enqueueSheetRetry(
      buildSheetPayload({ answers, score, scoreLabel: scoreInfo.label, reportHtml }),
      sheetError,
    )
  }

  const ok = sheetSaved || queued || (mode === 'ai' && aiGenerated)

  return res.status(200).json({
    ok,
    checks: {
      ...checks,
      aiGenerated,
      aiError,
      sheetSaved,
      sheetError,
      queued,
    },
    sample: {
      empresa: answers.nome,
      email: answers.email,
      telefone: answers.telefone,
      score,
      scoreLabel: scoreInfo.label,
    },
    pillars,
    reportPreview: reportHtml.slice(0, 280),
  })
}
