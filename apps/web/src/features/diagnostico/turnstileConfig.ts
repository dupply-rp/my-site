const PLACEHOLDER_KEYS = new Set([
  'seu-site-key-turnstile',
  'seu-secret-turnstile',
  'your-site-key',
  'your-secret-key',
])

function isConfiguredKey(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return false
  if (PLACEHOLDER_KEYS.has(trimmed.toLowerCase())) return false
  if (/^(seu-|your-|xxx|changeme)/i.test(trimmed)) return false
  return true
}

export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

export const IS_TURNSTILE_ENABLED = isConfiguredKey(TURNSTILE_SITE_KEY)
