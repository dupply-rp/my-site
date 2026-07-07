import { SignJWT, jwtVerify } from 'jose'

function getSecretKey(): Uint8Array | null {
  const secret = process.env.CONSOLE_SECRET
  if (!secret) return null
  return new TextEncoder().encode(secret)
}

export async function signConsoleToken(tenantSlug: string): Promise<string | null> {
  const key = getSecretKey()
  if (!key) return null

  return new SignJWT({ tenant: tenantSlug })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(key)
}

export async function verifyConsoleToken(token: string): Promise<{ tenantSlug: string } | null> {
  const key = getSecretKey()
  if (!key) return null

  try {
    const { payload } = await jwtVerify(token, key)
    return { tenantSlug: String(payload.tenant ?? process.env.DEFAULT_TENANT_SLUG ?? 'dupply') }
  } catch {
    return null
  }
}
