import { verifyConsolePassword } from '../lib/consoleAuth'
import { signConsoleToken } from '../lib/consoleSession'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Método não permitido' }, { status: 405 })
  }

  if (!process.env.CONSOLE_SECRET) {
    return Response.json({ error: 'Console não configurado (CONSOLE_SECRET ausente)' }, { status: 503 })
  }

  let body: { password?: string }
  try {
    body = (await request.json()) as { password?: string }
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const password = String(body.password ?? '')
  if (!verifyConsolePassword(password)) {
    return Response.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const tenantSlug = process.env.DEFAULT_TENANT_SLUG ?? 'dupply'
  const token = await signConsoleToken(tenantSlug)
  if (!token) {
    return Response.json({ error: 'Não foi possível criar sessão' }, { status: 500 })
  }

  return Response.json({ ok: true, token, tenantSlug })
}
