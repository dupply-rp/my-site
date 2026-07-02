import type { Answers, DiagnosticoApiResponse } from './types'

export async function fetchDiagnosticoFromApi(
  answers: Answers,
): Promise<DiagnosticoApiResponse | null> {
  try {
    const response = await fetch('/api/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })

    const data = (await response.json()) as DiagnosticoApiResponse

    if (!response.ok) {
      console.warn('[diagnostico] API:', data.error ?? response.status)
      return null
    }

    if (data.sheetSaved === false && !data.sheetQueued && !data.sheetPending) {
      console.warn('[diagnostico] Lead não salvo na planilha — verifique GOOGLE_SHEETS_WEBHOOK_URL na Vercel')
    }

    return data
  } catch (error) {
    console.warn('[diagnostico] API indisponível:', error)
    return null
  }
}
