export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Método não permitido' }, { status: 405 })
  }

  const secret = process.env.CONSOLE_SECRET
  if (!secret) {
    return Response.json({ error: 'Console não configurado (CONSOLE_SECRET ausente)' }, { status: 503 })
  }

  let body: { password?: string }
  try {
    body = (await request.json()) as { password?: string }
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const password = String(body.password ?? '')
  if (password !== secret) {
    return Response.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const tenantSlug = process.env.DEFAULT_TENANT_SLUG ?? 'dupply'
  return Response.json({ ok: true, token: secret, tenantSlug })
}
