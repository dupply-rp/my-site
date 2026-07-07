import type { VercelRequest, VercelResponse } from '@vercel/node'

import { verifyConsoleAuthFromToken } from '../lib/consoleAuth'
import { getDiagnosticoById, listDiagnosticos } from '../lib/consoleQueries'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const auth = await verifyConsoleAuthFromToken(req.headers.authorization)
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const id = typeof req.query.id === 'string' ? req.query.id : null

  try {
    if (id) {
      const diagnostico = await getDiagnosticoById(auth.tenantSlug, id)
      if (!diagnostico) {
        return res.status(404).json({ error: 'Diagnóstico não encontrado' })
      }
      return res.status(200).json({ diagnostico })
    }

    const limit = Math.min(Number(req.query.limit ?? 100) || 100, 200)
    const items = await listDiagnosticos(auth.tenantSlug, limit)
    return res.status(200).json({ items, total: items.length, tenantSlug: auth.tenantSlug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao consultar banco'
    console.error('[console/diagnosticos]', message)
    return res.status(500).json({ error: message })
  }
}
