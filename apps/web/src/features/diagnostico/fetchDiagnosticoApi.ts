import type { Answers, DiagnosticoApiResponse } from './types'

export type DiagnosticoApiResult =
  | { ok: true; data: DiagnosticoApiResponse }
  | { ok: false; error: string; retryAfterSec?: number; showFallback?: boolean }

export async function fetchDiagnosticoFromApi(
  answers: Answers,
  turnstileToken?: string,
): Promise<DiagnosticoApiResult> {
  try {
    const response = await fetch('/api/health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers,
        turnstileToken,
        website: '',
      }),
    })

    const data = (await response.json()) as DiagnosticoApiResponse & {
      retryAfterSec?: number
    }

    if (!response.ok) {
      return {
        ok: false,
        error: data.error ?? 'Não foi possível gerar o relatório. Tente novamente.',
        retryAfterSec: data.retryAfterSec,
        showFallback: response.status >= 500,
      }
    }

    if (data.sheetSaved === false && !data.sheetQueued && !data.sheetPending) {
      console.warn('[diagnostico] Lead não salvo na planilha — verifique GOOGLE_SHEETS_WEBHOOK_URL na Vercel')
    }

    return { ok: true, data }
  } catch (error) {
    console.warn('[diagnostico] API indisponível:', error)
    return { ok: false, error: 'Serviço temporariamente indisponível. Tente novamente em instantes.', showFallback: true }
  }
}
