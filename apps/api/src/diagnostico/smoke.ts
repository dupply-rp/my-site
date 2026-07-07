import { buildSummary, buildFallbackReport, calcPillars, calcScore, getScoreInfo } from '@dupply/diagnostico'
import { generateAnthropicReport } from '../lib/anthropic'
import { saveToGoogleSheets } from '../lib/googleSheets'
import { isRetryQueueEnabled, enqueueSheetRetry } from '../lib/retryQueue'
import { createSmokeAnswers } from '../lib/smokeFixture'
import { buildSheetPayload } from '../lib/sheetPayload'

export const config = {
  maxDuration: 60,
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.DIAGNOSTICO_TEST_SECRET
  if (!secret) return false

  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${secret}`) return true

  const url = new URL(request.url)
  return url.searchParams.get('secret') === secret
}

export default async function handler(request: Request) {
  if (request.method !== 'POST' && request.method !== 'GET') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  if (!isAuthorized(request)) {
    return jsonResponse({ error: 'Não autorizado — configure DIAGNOSTICO_TEST_SECRET' }, 401)
  }

  const url = new URL(request.url)
  const mode = url.searchParams.get('mode') ?? 'full'

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

    return jsonResponse({
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

  return jsonResponse({
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
