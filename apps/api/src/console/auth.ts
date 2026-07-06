import type { VercelRequest, VercelResponse } from '@vercel/node'

import { verifyConsolePassword } from '../lib/consoleAuth'

export default function handler(req: VercelRequest, res: VercelResponse) {
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

  return res.status(200).json({ ok: true })
}
