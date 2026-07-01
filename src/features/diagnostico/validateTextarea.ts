import type { TextareaQuestion } from './types'

export function validateTextareaField(
  question: TextareaQuestion,
  value: string,
): string | undefined {
  const trimmed = value.trim()

  if (question.required && !trimmed) {
    return 'Este campo é obrigatório.'
  }

  if (trimmed && question.minLength && trimmed.length < question.minLength) {
    return `Escreva pelo menos ${question.minLength} caracteres para personalizarmos melhor o relatório — ou deixe em branco para pular.`
  }

  if (question.maxLength && trimmed.length > question.maxLength) {
    return `Use no máximo ${question.maxLength} caracteres.`
  }

  return undefined
}
