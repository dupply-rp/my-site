import { waitUntil } from '@vercel/functions'
import { buildSummary } from './lib/diagnostico/buildSummary'
import { buildFallbackReport } from './lib/diagnostico/fallbackReport'
import { calcPillars, calcScore, getScoreInfo } from './lib/diagnostico/scoring'
import type { Answers } from './lib/diagnostico/types'
import { generateAnthropicReport } from './lib/anthropic'
import { saveToGoogleSheets } from './lib/googleSheets'
import { enqueueSheetRetry } from './lib/retryQueue'
import { buildSheetPayload } from './lib/sheetPayload'

export const config = {
  runtime: 'edge',
}

function isAnswers(value: unknown): value is Answers {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Método não permitido' }, 405)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ error: 'JSON inválido' }, 400)
  }

  const { answers } = (body ?? {}) as { answers?: unknown }

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

  return jsonResponse({
    reportHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    sheetPending: true,
  })
}
