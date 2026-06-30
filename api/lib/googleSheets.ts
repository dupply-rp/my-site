interface SheetPayload {
  timestamp: string
  empresa: string
  email: string
  telefone: string
  setor: string
  porte: string
  faturamento: string
  score: number
  scoreLabel: string
  maiorDor: string
  budget: string
  objetivo: string
  respostas: Record<string, unknown>
  relatorio: string
  secret?: string
}

function asString(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

async function postToAppsScript(webhookUrl: string, payload: SheetPayload): Promise<void> {
  // Google Apps Script responde 302; fetch com redirect:'follow' em POST retorna 500 no Node.
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    redirect: 'manual',
  })

  let finalResponse = response

  if (response.status === 302 || response.status === 301) {
    const location = response.headers.get('location')
    if (!location) {
      throw new Error('Google Sheets webhook: redirect sem Location')
    }
    finalResponse = await fetch(location, { method: 'GET' })
  }

  const body = await finalResponse.text()

  if (!finalResponse.ok) {
    throw new Error(`Google Sheets webhook falhou (${finalResponse.status}): ${body.slice(0, 300)}`)
  }

  try {
    const parsed = JSON.parse(body) as { ok?: boolean; error?: string }
    if (parsed.ok === false) {
      throw new Error(parsed.error ?? 'Google Sheets webhook retornou erro')
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Google Sheets webhook resposta inválida: ${body.slice(0, 300)}`)
    }
    throw error
  }
}

export async function saveToGoogleSheets(input: {
  answers: Record<string, unknown>
  score: number
  scoreLabel: string
  reportHtml: string
}): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('GOOGLE_SHEETS_WEBHOOK_URL não configurada — lead não salvo')
    return
  }

  const { answers, score, scoreLabel, reportHtml } = input

  const payload: SheetPayload = {
    timestamp: new Date().toISOString(),
    empresa: asString(answers.nome),
    email: asString(answers.email),
    telefone: asString(answers.telefone),
    setor: asString(answers.setor),
    porte: asString(answers.porte),
    faturamento: asString(answers.faturamento),
    score,
    scoreLabel,
    maiorDor: asString(answers.maior_dor),
    budget: asString(answers.budget),
    objetivo: asString(answers.objetivo_principal),
    respostas: answers,
    relatorio: reportHtml.slice(0, 5000),
  }

  const secret = process.env.DIAGNOSTICO_WEBHOOK_SECRET
  if (secret) payload.secret = secret

  await postToAppsScript(webhookUrl, payload)
}
