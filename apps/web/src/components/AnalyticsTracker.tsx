import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieConsentBanner } from './CookieConsentBanner'
import { DIAGNOSTICO_PATH, PRIVACIDADE_PATH } from '../constants/links'
import { DIAGNOSTICO_TITLE, SITE_NAME, SITE_TITLE } from '../constants/site'
import { initAnalytics, trackPageView } from '../lib/analytics'
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  isAnalyticsAllowed,
  type CookieConsent,
} from '../lib/cookieConsent'

function titleForPath(pathname: string): string {
  if (pathname === DIAGNOSTICO_PATH || pathname.startsWith(`${DIAGNOSTICO_PATH}/`)) {
    return DIAGNOSTICO_TITLE
  }
  if (pathname === PRIVACIDADE_PATH) {
    return `Privacidade | ${SITE_NAME}`
  }
  return SITE_TITLE
}

export function AnalyticsTracker() {
  const location = useLocation()

  const enableAnalyticsIfAllowed = useCallback(() => {
    if (!isAnalyticsAllowed()) return
    initAnalytics()
    const path = `${window.location.pathname}${window.location.search}${window.location.hash}`
    trackPageView(path, titleForPath(window.location.pathname))
  }, [])

  useEffect(() => {
    enableAnalyticsIfAllowed()

    const onConsentChange = (event: Event) => {
      const consent = (event as CustomEvent<CookieConsent | null>).detail
      if (consent?.analytics) {
        enableAnalyticsIfAllowed()
      }
    }

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange)
    return () => window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange)
  }, [enableAnalyticsIfAllowed])

  useEffect(() => {
    if (!isAnalyticsAllowed()) return
    const path = `${location.pathname}${location.search}${location.hash}`
    trackPageView(path, titleForPath(location.pathname))
  }, [location])

  return <CookieConsentBanner onAnalyticsAccepted={enableAnalyticsIfAllowed} />
}
