const STORAGE_KEY = 'dupply-cookie-consent-v1'
const CONSENT_VERSION = 1 as const

export const COOKIE_CONSENT_CHANGE_EVENT = 'dupply:cookie-consent-change'
export const COOKIE_CONSENT_OPEN_EVENT = 'dupply:cookie-consent-open'

export interface CookieConsent {
  version: typeof CONSENT_VERSION
  /** Analytics (GA4). Cookies essenciais (tema, rascunho do diagnóstico) não pedem opt-in. */
  analytics: boolean
  updatedAt: number
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function emitChange(consent: CookieConsent | null): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_CHANGE_EVENT, { detail: consent }))
}

export function getCookieConsent(): CookieConsent | null {
  if (!canUseStorage()) return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as CookieConsent
    if (parsed?.version !== CONSENT_VERSION || typeof parsed.analytics !== 'boolean') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function hasAnsweredCookieConsent(): boolean {
  return getCookieConsent() !== null
}

export function isAnalyticsAllowed(): boolean {
  return getCookieConsent()?.analytics === true
}

function saveConsent(analytics: boolean): CookieConsent {
  const consent: CookieConsent = {
    version: CONSENT_VERSION,
    analytics,
    updatedAt: Date.now(),
  }

  if (canUseStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
    } catch {
      // private mode / quota
    }
  }

  emitChange(consent)
  return consent
}

export function acceptAllCookies(): CookieConsent {
  return saveConsent(true)
}

export function acceptNecessaryCookiesOnly(): CookieConsent {
  return saveConsent(false)
}

/** Reabre o banner (ex.: “Gerenciar cookies” na página de privacidade). */
export function openCookieConsentPreferences(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_EVENT))
}
