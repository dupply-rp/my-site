import type { VercelRequest, VercelResponse } from '@vercel/node'
import { buildSummary } from './lib/diagnostico/buildSummary'
import { buildFallbackReport } from './lib/diagnostico/fallbackReport'
import { calcPillars, calcScore, getScoreInfo } from './lib/diagnostico/scoring'
import type { Answers } from './lib/diagnostico/types'
import { generateAnthropicReport } from './lib/anthropic'
import { saveToGoogleSheets } from './lib/googleSheets'

function isAnswers(value: unknown): value is Answers {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { answers } = req.body ?? {}

  if (!isAnswers(answers)) {
    return res.status(400).json({ error: 'Respostas inválidas' })
  }

  if (!String(answers.nome ?? '').trim()) {
    return res.status(400).json({ error: 'Nome da empresa é obrigatório' })
  }

  const summary = buildSummary(answers)
  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)
  const pillars = calcPillars(answers)

  let reportHtml: string
  let aiGenerated = false

  try {
    reportHtml = await generateAnthropicReport(summary)
    aiGenerated = true
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao gerar relatório'
    console.error('[diagnostico] Anthropic:', message)
    reportHtml = buildFallbackReport(answers, scoreInfo)
  }

  let sheetSaved = false
  try {
    await saveToGoogleSheets({ answers, score, scoreLabel: scoreInfo.label, reportHtml })
    sheetSaved = true
  } catch (error) {
    console.error('[diagnostico] Google Sheets:', error)
  }

  return res.status(200).json({
    reportHtml,
    score,
    scoreInfo,
    pillars,
    aiGenerated,
    sheetSaved,
  })
}
