import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  maxDuration: 60,
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    return res.status(200).json({ ok: true, route: 'diagnostico-handler' })
  }
  return res.status(405).json({ error: 'Método não permitido' })
}
