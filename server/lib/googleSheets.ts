import { buildSheetPayload, type SheetPayload } from './sheetPayload.js'

export type { SheetPayload }

export async function postSheetPayload(payload: SheetPayload): Promise<void> {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    throw new Error('GOOGLE_SHEETS_WEBHOOK_URL não configurada')
  }

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
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn('GOOGLE_SHEETS_WEBHOOK_URL não configurada — lead não salvo')
    return
  }

  await postSheetPayload(buildSheetPayload(input))
}
