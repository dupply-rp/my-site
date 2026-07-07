import type { VercelRequest, VercelResponse } from '@vercel/node'

import { verifyConsolePassword } from '../lib/consoleAuth'
import { signConsoleToken } from '../lib/consoleSession'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  if (!process.env.CONSOLE_SECRET) {
    return res.status(503).json({ error: 'Console não configurado (CONSOLE_SECRET ausente)' })
  }

  const password = String(req.body?.password ?? '')
  if (!verifyConsolePassword(password)) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }

  const tenantSlug = process.env.DEFAULT_TENANT_SLUG ?? 'dupply'
  const token = await signConsoleToken(tenantSlug)
  if (!token) {
    return res.status(500).json({ error: 'Não foi possível criar sessão' })
  }

  return res.status(200).json({ ok: true, token, tenantSlug })
}
