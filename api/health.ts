import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  maxDuration: 60,
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, service: 'dupply-diagnostico' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { handleDiagnosticoPost } = await import('../apps/api/src/health-diagnostico.js')
    return handleDiagnosticoPost(req, res)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    console.error('[health] Falha ao carregar diagnóstico:', message)
    return res.status(500).json({ error: 'Serviço temporariamente indisponível' })
  }
}
