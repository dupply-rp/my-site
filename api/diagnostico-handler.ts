import type { VercelRequest, VercelResponse } from '@vercel/node'
import { calcScore, getScoreInfo } from '@dupply/diagnostico'

export const config = {
  maxDuration: 60,
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  const answers = (req.body as { answers?: Record<string, unknown> } | undefined)?.answers ?? {}
  const score = calcScore(answers as never)
  return res.status(200).json({ ok: true, score, scoreInfo: getScoreInfo(score) })
}
