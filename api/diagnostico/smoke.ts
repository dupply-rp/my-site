import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = {
  maxDuration: 60,
}

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<unknown>

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { default: run } = (await import('./smoke.bundle.js')) as { default: Handler }
    return run(req, res)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    console.error('[diagnostico/smoke] Falha ao carregar bundle:', message)
    return res.status(500).json({ error: 'Serviço temporariamente indisponível' })
  }
}
