import type { VercelRequest, VercelResponse } from '@vercel/node'
import { mapEmailErrorForClient, sendContactRequestEmail } from './lib/sendReportEmail'

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export async function handleSolicitarContato(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const body = (req.body ?? {}) as {
    empresa?: string
    email?: string
    telefone?: string
    score?: number
    scoreLabel?: string
  }

  const empresa = String(body.empresa ?? '').trim()
  const email = String(body.email ?? '').trim()
  const telefone = String(body.telefone ?? '').trim()

  if (!empresa) {
    return res.status(400).json({ error: 'Empresa é obrigatória' })
  }

  if (!email && !telefone) {
    return res.status(400).json({ error: 'Informe e-mail ou telefone para contato' })
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'E-mail inválido' })
  }

  try {
    await sendContactRequestEmail({
      empresa,
      email: email || undefined,
      telefone: telefone || undefined,
      score: typeof body.score === 'number' ? body.score : undefined,
      scoreLabel: body.scoreLabel?.trim() || undefined,
    })

    return res.status(200).json({ ok: true })
  } catch (error) {
    const internal = error instanceof Error ? error.message : 'Erro ao solicitar contato'
    console.error('[solicitar-contato]', internal)
    return res.status(503).json({ error: mapEmailErrorForClient(error) })
  }
}

export default handleSolicitarContato
