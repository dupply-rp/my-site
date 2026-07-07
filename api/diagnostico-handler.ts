import type { VercelRequest, VercelResponse } from '@vercel/node'
import { calcScore, getScoreInfo } from '../packages/diagnostico/src/scoring'
import type { Answers } from '../packages/types/src/diagnostico'

export const config = {
  maxDuration: 60,
}

function isAnswers(value: unknown): value is Answers {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { answers } = (req.body ?? {}) as { answers?: unknown }
  if (!isAnswers(answers)) {
    return res.status(400).json({ error: 'Respostas inválidas' })
  }

  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)
  return res.status(200).json({ ok: true, score, scoreInfo })
}
