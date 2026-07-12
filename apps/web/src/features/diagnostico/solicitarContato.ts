interface SolicitarContatoInput {
  empresa: string
  email?: string
  telefone?: string
  score?: number
  scoreLabel?: string
}

export async function solicitarContatoDupply(input: SolicitarContatoInput): Promise<void> {
  const response = await fetch('/api/solicitar-contato', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const data = (await response.json()) as { ok?: boolean; error?: string }
  if (!response.ok || !data.ok) {
    throw new Error(data.error ?? 'Não foi possível enviar sua solicitação')
  }
}
