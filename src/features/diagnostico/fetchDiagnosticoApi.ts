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

    return data
  } catch (error) {
    console.warn('[diagnostico] API indisponível:', error)
    return null
  }
}
