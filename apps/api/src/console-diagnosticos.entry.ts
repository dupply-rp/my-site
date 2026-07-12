import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifyConsoleAuthFromToken } from './lib/consoleAuth'
import { getDiagnosticoById, listDiagnosticos } from './lib/consoleQueries'
import { addNotifyEmail, listNotifyEmails, removeNotifyEmail } from './lib/notifyEmailQueries'

function isNotifyEmailsRoute(req: VercelRequest): boolean {
  const url = req.url ?? ''
  return url.includes('/notify-emails')
}

async function handleDiagnosticos(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const auth = await verifyConsoleAuthFromToken(req.headers.authorization)
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const id = typeof req.query.id === 'string' ? req.query.id : undefined

  try {
    if (id) {
      const diagnostico = await getDiagnosticoById(auth.tenantSlug, id)
      if (!diagnostico) {
        return res.status(404).json({ error: 'Diagnóstico não encontrado' })
      }
      return res.status(200).json({ diagnostico })
    }

    const limitRaw = typeof req.query.limit === 'string' ? req.query.limit : '100'
    const limit = Math.min(Number(limitRaw) || 100, 200)
    const items = await listDiagnosticos(auth.tenantSlug, limit)
    return res.status(200).json({ items, total: items.length, tenantSlug: auth.tenantSlug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao consultar banco'
    console.error('[console/diagnosticos]', message)
    return res.status(500).json({ error: message })
  }
}

async function handleNotifyEmails(req: VercelRequest, res: VercelResponse) {
  const auth = await verifyConsoleAuthFromToken(req.headers.authorization)
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  try {
    if (req.method === 'GET') {
      const items = await listNotifyEmails(auth.tenantSlug)
      return res.status(200).json({
        items: items.map((item) => ({
          id: item.id,
          email: item.email,
          label: item.label,
          createdAt: item.createdAt.toISOString(),
        })),
        total: items.length,
        tenantSlug: auth.tenantSlug,
      })
    }

    if (req.method === 'POST') {
      const body = (req.body ?? {}) as { email?: string; label?: string }
      const email = String(body.email ?? '').trim()
      if (!email) {
        return res.status(400).json({ error: 'E-mail é obrigatório' })
      }

      const item = await addNotifyEmail(auth.tenantSlug, email, body.label)
      return res.status(201).json({
        item: {
          id: item.id,
          email: item.email,
          label: item.label,
          createdAt: item.createdAt.toISOString(),
        },
      })
    }

    if (req.method === 'DELETE') {
      const id = typeof req.query.id === 'string' ? req.query.id : ''
      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' })
      }

      const removed = await removeNotifyEmail(auth.tenantSlug, id)
      if (!removed) {
        return res.status(404).json({ error: 'E-mail não encontrado' })
      }

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao gerenciar e-mails'
    console.error('[console/notify-emails]', message)
    return res.status(500).json({ error: message })
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (isNotifyEmailsRoute(req)) {
    return handleNotifyEmails(req, res)
  }

  return handleDiagnosticos(req, res)
}
