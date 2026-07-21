import { GA_MEASUREMENT_ID, IS_GA_ENABLED } from './analyticsConfig'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let initialized = false

export function initAnalytics(): void {
  if (!IS_GA_ENABLED || initialized || typeof window === 'undefined') return

  initialized = true
  window.dataLayer = window.dataLayer ?? []
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script)
}

export function trackPageView(path: string, title?: string): void {
  if (!IS_GA_ENABLED || !window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    page_location: `${window.location.origin}${path}`,
  })
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (!IS_GA_ENABLED || !window.gtag) return

  const payload = Object.fromEntries(
    Object.entries(params ?? {}).filter((entry): entry is [string, string | number | boolean] => {
      return entry[1] !== undefined
    }),
  )

  window.gtag('event', name, payload)
}
