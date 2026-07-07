import { verifyConsoleToken } from './consoleSession'

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
  if (!token) return null

  const session = await verifyConsoleToken(token)
  if (session) return session

  if (token === secret) {
    return { tenantSlug: process.env.DEFAULT_TENANT_SLUG ?? 'dupply' }
  }

  return null
}
