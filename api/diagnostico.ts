import { calcScore, getScoreInfo } from '@dupply/diagnostico'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Método não permitido' }, { status: 405 })
  }

  let body: { answers?: Record<string, unknown> }
  try {
    body = (await request.json()) as { answers?: Record<string, unknown> }
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const answers = body.answers ?? { nome: 'Teste' }
  const score = calcScore(answers)
  const scoreInfo = getScoreInfo(score)

  return Response.json({ ok: true, score, scoreInfo })
}
