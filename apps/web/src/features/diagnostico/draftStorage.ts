import type { Answers } from './types'

const STORAGE_KEY = 'dupply-diagnostico-draft-v1'
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7 // 7 dias

export interface DiagnosticoDraft {
  currentIndex: number
  answers: Answers
  updatedAt: number
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadDiagnosticoDraft(): DiagnosticoDraft | null {
  if (!canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as DiagnosticoDraft
    if (
      typeof parsed?.currentIndex !== 'number' ||
      typeof parsed?.updatedAt !== 'number' ||
      !parsed.answers ||
      typeof parsed.answers !== 'object'
    ) {
      return null
    }

    if (Date.now() - parsed.updatedAt > MAX_AGE_MS) {
      clearDiagnosticoDraft()
      return null
    }

    return parsed
  } catch {
    return null
  }
}

export function saveDiagnosticoDraft(draft: Omit<DiagnosticoDraft, 'updatedAt'>): void {
  if (!canUseStorage()) return

  try {
    const payload: DiagnosticoDraft = {
      ...draft,
      updatedAt: Date.now(),
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // quota / private mode — ignore
  }
}

export function clearDiagnosticoDraft(): void {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
