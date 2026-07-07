function getBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}

export function verifyConsolePassword(password: string): boolean {
  const secret = process.env.CONSOLE_SECRET
  if (!secret) return false
  return password === secret
}

export async function verifyConsoleAuthFromToken(
  authHeader: string | undefined | null,
): Promise<{ tenantSlug: string } | null> {
  const secret = process.env.CONSOLE_SECRET
  if (!secret) return null

  const token = getBearerToken(authHeader ?? undefined)
  if (!token || token !== secret) return null

  return { tenantSlug: process.env.DEFAULT_TENANT_SLUG ?? 'dupply' }
}
