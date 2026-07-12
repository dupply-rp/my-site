/** Remove aspas e espaços extras comuns em variáveis da Vercel. */
export function sanitizeEnvValue(value: string | undefined): string {
  if (!value) return ''

  let trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1).trim()
  }

  return trimmed
}
