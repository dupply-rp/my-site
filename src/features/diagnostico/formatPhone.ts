/** Remove tudo que não for dígito (valor enviado à API). */
export function stripPhoneDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

/** Formata para exibição: (77) 98814-2278 ou (77) 8814-2278 */
export function formatPhoneBr(value: string): string {
  const digits = stripPhoneDigits(value)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}
