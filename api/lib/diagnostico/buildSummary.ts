import { allQuestions } from './questions.js'
import type { Answers } from './types.js'

const CONTEXT_MAX_CHARS = 800
const SKIP_CONTACT_FIELDS = new Set(['email', 'telefone'])

export function buildSummary(answers: Answers): string {
  const lines = allQuestions
    .flatMap((question) => {
      if (question.id === 'contexto_negocio') return []

      if (question.type === 'contact') {
        return question.fields
          .filter((field) => !SKIP_CONTACT_FIELDS.has(field.id))
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

  const contexto = String(answers.contexto_negocio ?? '').trim()
  if (!contexto) return lines

  const trimmed =
    contexto.length > CONTEXT_MAX_CHARS ? `${contexto.slice(0, CONTEXT_MAX_CHARS)}…` : contexto

  return `${lines}\n\n--- CONTEXTO EM ABERTO DO EMPRESÁRIO (PRIORIZE NA ANÁLISE) ---\n${trimmed}`
}
