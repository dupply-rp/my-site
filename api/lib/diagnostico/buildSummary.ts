import { allQuestions } from './questions'
import type { Answers } from './types'

export function buildSummary(answers: Answers): string {
  return allQuestions
    .flatMap((question) => {
      if (question.type === 'contact') {
        return question.fields
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
}
