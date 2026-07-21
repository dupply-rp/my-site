import { GA_MEASUREMENT_ID, IS_GA_ENABLED } from './analyticsConfig'
import { isAnalyticsAllowed } from './cookieConsent'

declare global {
  interface Window {
    dataLayer?: object[]
    // Official gtag uses Arguments; rest-args wrappers break GA4 ingestion.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void
  }
}

let initialized = false

export function initAnalytics(): void {
  if (!IS_GA_ENABLED || !isAnalyticsAllowed() || initialized || typeof window === 'undefined') return

  initialized = true

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag() {
    // Must push `arguments` (not a rest array) — formato oficial do Google.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  })
}

export function trackPageView(path: string, title?: string): void {
  if (!IS_GA_ENABLED || !isAnalyticsAllowed() || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    page_location: `${window.location.origin}${path}`,
    send_to: GA_MEASUREMENT_ID,
  })
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (!IS_GA_ENABLED || !isAnalyticsAllowed() || !window.gtag) return

  const payload = Object.fromEntries(
    Object.entries(params ?? {}).filter((entry): entry is [string, string | number | boolean] => {
      return entry[1] !== undefined
    }),
  )

  window.gtag('event', name, {
    ...payload,
    send_to: GA_MEASUREMENT_ID,
  })
}

/** Eventos para marcar como “eventos principais” no GA4 Admin. */
export const GA_CONVERSION_EVENTS = [
  'diagnostico_complete',
  'diagnostico_contact_request',
  'generate_lead',
] as const

export function trackCtaClick(
  cta: string,
  params?: { location?: string; destination?: string },
): void {
  trackEvent('cta_click', {
    cta_name: cta,
    cta_location: params?.location,
    destination: params?.destination,
  })
}

export function trackConversion(
  name: (typeof GA_CONVERSION_EVENTS)[number],
  params?: Record<string, string | number | boolean | undefined>,
): void {
  trackEvent(name, params)
}
