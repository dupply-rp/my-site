interface TurnstileVerifyResponse {
  success?: boolean
  'error-codes'?: string[]
}

function isConfiguredSecret(value: string | undefined): boolean {
  const secret = value?.trim()
  if (!secret) return false
  const lower = secret.toLowerCase()
  if (lower === 'seu-secret-turnstile') return false
  if (/^(seu-|your-|xxx|changeme)/i.test(secret)) return false
  return true
}

export function isTurnstileEnabled(): boolean {
  return isConfiguredSecret(process.env.TURNSTILE_SECRET_KEY)
}

export async function verifyTurnstileToken(
  token: string | undefined,
  remoteIp?: string,
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()

  if (!isConfiguredSecret(secret)) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY não configurada — verificação desativada')
    return { ok: true }
  }

  if (!token?.trim()) {
    return { ok: false, error: 'Verificação de segurança obrigatória' }
  }

  const body = new URLSearchParams({
    secret,
    response: token.trim(),
  })

  if (remoteIp && remoteIp !== 'unknown') {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  const data = (await response.json()) as TurnstileVerifyResponse

  if (!response.ok || !data.success) {
    const codes = data['error-codes']?.join(', ') ?? 'falha na verificação'
    return { ok: false, error: codes }
  }

  return { ok: true }
}
