import { useEffect } from 'react'
import { SITE_URL } from '../../constants/site'

export interface PageMetaProps {
  title: string
  description: string
  path?: string
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

export function PageMeta({ title, description, path = '/', ogImage }: PageMetaProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path === '/' ? '/' : path}`
    const image = ogImage ?? `${SITE_URL}/og-image.png`

    document.title = title

    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [title, description, path, ogImage])

  return null
}
