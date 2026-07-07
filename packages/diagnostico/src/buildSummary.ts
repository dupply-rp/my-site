import type { Answers } from '@dupply/types/diagnostico'

import { allQuestions } from './questions'

export type BuildSummaryMode = 'preview' | 'api'

export interface BuildSummaryOptions {
  mode?: BuildSummaryMode
}

const CONTEXT_MAX_CHARS = 800
const SKIP_CONTACT_FIELDS = new Set(['email', 'telefone'])

export function buildSummary(answers: Answers, options: BuildSummaryOptions = {}): string {
  const mode = options.mode ?? 'preview'
  const isApi = mode === 'api'

  const lines = allQuestions
    .flatMap((question) => {
      if (isApi && question.id === 'contexto_negocio') return []

      if (question.type === 'contact') {
        const fields = isApi
          ? question.fields.filter((field) => !SKIP_CONTACT_FIELDS.has(field.id))
          : question.fields

        return fields
          .map((field) => {
            const answer = answers[field.id]
            if (!answer || (Array.isArray(answer) && answer.length === 0)) return null
            const formatted = Array.isArray(answer) ? answer.join(', ') : answer
            return `${field.label}: ${formatted}`
          })
          .filter((line): line is string => Boolean(line))
      }

      const answer = answers[question.id]
      if (!answer || (Array.isArray(answer) && answer.length === 0)) return []
      const formatted = Array.isArray(answer) ? answer.join(', ') : answer
      return [`${question.text}: ${formatted}`]
    })
    .join('\n')

  if (!isApi) return lines

  const contexto = String(answers.contexto_negocio ?? '').trim()
  if (!contexto) return lines

  const trimmed =
    contexto.length > CONTEXT_MAX_CHARS ? `${contexto.slice(0, CONTEXT_MAX_CHARS)}…` : contexto

  return `${lines}\n\n--- CONTEXTO EM ABERTO DO EMPRESÁRIO (PRIORIZE NA ANÁLISE) ---\n${trimmed}`
}

export interface AnswerRow {
  perguntaId: string
  perguntaTexto: string
  resposta: string
}

function asString(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

export function buildAnswerRows(answers: Answers): AnswerRow[] {
  const rows: AnswerRow[] = []

  for (const question of allQuestions) {
    if (question.type === 'contact') {
      for (const field of question.fields) {
        const answer = answers[field.id]
        if (!answer || (Array.isArray(answer) && answer.length === 0)) continue

        rows.push({
          perguntaId: field.id,
          perguntaTexto: field.label,
          resposta: asString(answer),
        })
      }
      continue
    }

    const answer = answers[question.id]
    if (!answer || (Array.isArray(answer) && answer.length === 0)) continue

    rows.push({
      perguntaId: question.id,
      perguntaTexto: question.text,
      resposta: asString(answer),
    })
  }

  return rows
}
