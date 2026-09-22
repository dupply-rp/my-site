import { useEffect } from 'react'
import type { RouteSeo } from '../../constants/seo'
import { SITE_URL } from '../../constants/site'

export interface PageMetaProps {
  route: RouteSeo
  ogImage?: string
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Espelha em runtime as mesmas meta tags que o build grava no HTML estático da
 * rota (vite.config.ts). Necessário porque a navegação client-side não recarrega
 * o documento — sem isso, ir da home para /termos manteria o canonical da home.
 */
export function PageMeta({ route, ogImage }: PageMetaProps) {
  const { path, title, description, ogDescription, indexable } = route

  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    const image = ogImage ?? `${SITE_URL}/og-image.png`
    const social = ogDescription ?? description

    document.title = title

    setMeta('name', 'description', description)
    setMeta(
      'name',
      'robots',
      indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, nofollow',
    )
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', social)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', social)
    setMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, ogDescription, path, indexable, ogImage])

  return null
}
