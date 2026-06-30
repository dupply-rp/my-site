import type { Answers, ContactField } from './types'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactFields(
  fields: ContactField[],
  answers: Answers,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    if (!field.required) continue

    const value = String(answers[field.id] ?? '').trim()

    if (!value) {
      errors[field.id] = `Informe ${field.label.toLowerCase()}.`
      continue
    }

    if (field.inputType === 'email' && !EMAIL_PATTERN.test(value)) {
      errors[field.id] = 'Informe um e-mail válido.'
    }

    if (field.inputType === 'tel' && value.replace(/\D/g, '').length < 10) {
      errors[field.id] = 'Informe um telefone válido com DDD.'
    }
  }

  return errors
}
