import type { VercelRequest, VercelResponse } from '@vercel/node'
import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import { generateAnthropicReport } from './lib/anthropic'
import { saveToGoogleSheets } from './lib/googleSheets'
import { isRetryQueueEnabled, enqueueSheetRetry } from './lib/retryQueue'
import { createSmokeAnswers } from './lib/smokeFixture'
import { buildSheetPayload } from './lib/sheetPayload'

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
