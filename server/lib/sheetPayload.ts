import { htmlToPlainText } from './htmlToPlainText.js'

export interface SheetPayload {
  timestamp: string
  empresa: string
  email: string
  telefone: string
  setor: string
  porte: string
  faturamento: string
  score: number
  scoreLabel: string
  maiorDor: string
  budget: string
  objetivo: string
  respostas: Record<string, unknown>
  relatorio: string
  secret?: string
}

function asString(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

export function buildSheetPayload(input: {
  answers: Record<string, unknown>
  score: number
  scoreLabel: string
  reportHtml: string
}): SheetPayload {
  const { answers, score, scoreLabel, reportHtml } = input

  const payload: SheetPayload = {
    timestamp: new Date().toISOString(),
    empresa: asString(answers.nome),
    email: asString(answers.email),
    telefone: asString(answers.telefone),
    setor: asString(answers.setor),
    porte: asString(answers.porte),
    faturamento: asString(answers.faturamento),
    score,
    scoreLabel,
    maiorDor: asString(answers.maior_dor),
    budget: asString(answers.budget),
    objetivo:
      asString(answers.contexto_negocio).slice(0, 200) || asString(answers.maior_dor),
    respostas: answers,
    relatorio: htmlToPlainText(reportHtml).slice(0, 8000),
  }

  const secret = process.env.DIAGNOSTICO_WEBHOOK_SECRET
  if (secret) payload.secret = secret

  return payload
}
