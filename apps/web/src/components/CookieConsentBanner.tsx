import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PRIVACIDADE_PATH } from '../constants/links'
import {
  acceptAllCookies,
  acceptNecessaryCookiesOnly,
  COOKIE_CONSENT_OPEN_EVENT,
  hasAnsweredCookieConsent,
} from '../lib/cookieConsent'

interface CookieConsentBannerProps {
  onAnalyticsAccepted?: () => void
}

export function CookieConsentBanner({ onAnalyticsAccepted }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!hasAnsweredCookieConsent())

    const onOpen = () => setVisible(true)
    window.addEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen)
    return () => window.removeEventListener(COOKIE_CONSENT_OPEN_EVENT, onOpen)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('cookie-banner-open', visible)
    return () => document.body.classList.remove('cookie-banner-open')
  }, [visible])

  const handleAcceptAll = useCallback(() => {
    acceptAllCookies()
    setVisible(false)
    onAnalyticsAccepted?.()
  }, [onAnalyticsAccepted])

  const handleNecessaryOnly = useCallback(() => {
    acceptNecessaryCookiesOnly()
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-live="polite">
      <div className="cookie-banner-inner wrap">
        <div className="cookie-banner-copy">
          <p id="cookie-banner-title" className="cookie-banner-title">
            Cookies e privacidade
          </p>
          <p className="cookie-banner-text">
            Usamos cookies essenciais para o site funcionar (tema e rascunho do diagnóstico) e, com sua
            permissão, cookies de analytics (Google Analytics) para melhorar a experiência. Veja os
            detalhes na{' '}
            <Link to={PRIVACIDADE_PATH}>política de privacidade</Link>.
          </p>
        </div>
        <div className="cookie-banner-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleNecessaryOnly}>
            Apenas necessários
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleAcceptAll}>
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  )
}
