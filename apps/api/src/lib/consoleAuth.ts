function getBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith('Bearer ')) return null
  return header.slice('Bearer '.length).trim() || null
}

export function verifyConsoleAuth(request: Request): boolean {
  return verifyConsoleAuthFromToken(request.headers.get('authorization'))
}

export function verifyConsoleAuthFromToken(authHeader: string | undefined | null): boolean {
  const secret = process.env.CONSOLE_SECRET
  if (!secret) return false

  const token = getBearerToken(authHeader ?? undefined)
  return token === secret
}

export function verifyConsolePassword(password: string): boolean {
  const secret = process.env.CONSOLE_SECRET
  if (!secret) return false
  return password === secret
}
