import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DIAGNOSTICO_PATH } from '../constants/links'
import { DIAGNOSTICO_TITLE, SITE_TITLE } from '../constants/site'
import { initAnalytics, trackPageView } from '../lib/analytics'

function titleForPath(pathname: string): string {
  if (pathname === DIAGNOSTICO_PATH || pathname.startsWith(`${DIAGNOSTICO_PATH}/`)) {
    return DIAGNOSTICO_TITLE
  }
  return SITE_TITLE
}

export function AnalyticsTracker() {
  const location = useLocation()

  useEffect(() => {
    initAnalytics()
  }, [])

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`
    trackPageView(path, titleForPath(location.pathname))
  }, [location])

  return null
}
