import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { NOT_FOUND_SEO, ROUTES_SEO, type RouteSeo } from './src/constants/seo'
import { SITE_URL } from './src/constants/site'

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
const ROBOTS_NOINDEX = 'noindex, nofollow'

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

/** Troca a tag existente no index.html; acrescenta no <head> se ela não existir. */
function upsertTag(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) return html.replace(matcher, tag)
  return html.replace('</head>', `    ${tag}\n  </head>`)
}

function metaTag(html: string, attr: 'name' | 'property', key: string, content: string): string {
  return upsertTag(
    html,
    new RegExp(`<meta[^>]*${attr}="${key}"[^>]*>`),
    `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`,
  )
}

function renderRoute(indexHtml: string, route: RouteSeo): string {
  const url = `${SITE_URL}${route.path}`
  const social = route.ogDescription ?? route.description

  let html = indexHtml.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
  html = metaTag(html, 'name', 'description', route.description)
  html = metaTag(html, 'name', 'robots', route.indexable ? ROBOTS_INDEX : ROBOTS_NOINDEX)
  html = metaTag(html, 'property', 'og:title', route.title)
  html = metaTag(html, 'property', 'og:description', social)
  html = metaTag(html, 'property', 'og:url', url)
  html = metaTag(html, 'name', 'twitter:title', route.title)
  html = metaTag(html, 'name', 'twitter:description', social)
  // Página fora do índice não declara canonical: não há versão preferida dela.
  html = route.indexable
    ? upsertTag(
        html,
        /<link[^>]*rel="canonical"[^>]*>/,
        `<link rel="canonical" href="${escapeAttr(url)}" />`,
      )
    : html.replace(/[^\S\n]*<link[^>]*rel="canonical"[^>]*>\n?/, '')
  return html
}

function renderSitemap(): string {
  const urls = ROUTES_SEO.filter((route) => route.indexable)
    .map((route) =>
      [
        '  <url>',
        `    <loc>${SITE_URL}${route.path}</loc>`,
        route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>` : null,
        route.priority ? `    <priority>${route.priority}</priority>` : null,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n'),
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

/**
 * A SPA serve um único index.html; sem isto toda rota chega ao Google com o
 * título e o canonical da home, e o Search Console marca as páginas como cópia.
 * O build grava um HTML por rota (`/termos` → `termos.html`) com as meta tags
 * certas — o nginx resolve `$uri.html` antes do fallback da SPA.
 */
function seoRoutes(): Plugin {
  return {
    name: 'dupply-seo-routes',
    apply: 'build',
    writeBundle(options, bundle) {
      const outDir = options.dir
      const index = bundle['index.html']
      if (!outDir || !index || index.type !== 'asset') {
        throw new Error('dupply-seo-routes: index.html não encontrado no bundle')
      }
      const indexHtml = index.source.toString()

      for (const route of ROUTES_SEO) {
        const file = route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}.html`
        writeFileSync(join(outDir, file), renderRoute(indexHtml, route))
      }
      // Servido pelo nginx no `error_page 404`, com o status 404 preservado.
      writeFileSync(join(outDir, '404.html'), renderRoute(indexHtml, NOT_FOUND_SEO))
      writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoRoutes()],
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: 3000,
    allowedHosts: true,
  },
})
