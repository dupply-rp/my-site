import {
  DIAGNOSTICO_PATH,
  DIAGNOSTICO_TEST_PATH,
  EXCLUSAO_DADOS_PATH,
  PRIVACIDADE_PATH,
  TERMOS_PATH,
} from './links'
import {
  DIAGNOSTICO_DESCRIPTION,
  DIAGNOSTICO_TITLE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_OG_DESCRIPTION,
  SITE_TITLE,
} from './site'

export interface RouteSeo {
  path: string
  title: string
  description: string
  /** Texto curto de compartilhamento; cai na description quando ausente. */
  ogDescription?: string
  /** Falso para páginas internas que não devem entrar no índice nem no sitemap. */
  indexable: boolean
  changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: string
}

/**
 * Fonte única das rotas do site: alimenta o <PageMeta> em runtime, os HTMLs
 * estáticos por rota e o sitemap.xml gerados no build (ver vite.config.ts).
 * Sem isso o Google lê o mesmo index.html — com canonical da home — em toda
 * rota e marca as páginas como cópia.
 */
export const ROUTES_SEO: RouteSeo[] = [
  {
    path: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    ogDescription: SITE_OG_DESCRIPTION,
    indexable: true,
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: DIAGNOSTICO_PATH,
    title: DIAGNOSTICO_TITLE,
    description: DIAGNOSTICO_DESCRIPTION,
    indexable: true,
    changefreq: 'weekly',
    priority: '0.9',
  },
  {
    path: PRIVACIDADE_PATH,
    title: `Privacidade | ${SITE_NAME}`,
    description:
      'Como a Dupply coleta, usa e protege dados no site, no diagnóstico gratuito e na plataforma Dupply Atende (WhatsApp e Instagram). Em linguagem clara, alinhada à LGPD.',
    indexable: true,
    changefreq: 'monthly',
    priority: '0.3',
  },
  {
    path: TERMOS_PATH,
    title: `Termos de Serviço | ${SITE_NAME}`,
    description:
      'Condições de uso do site, do diagnóstico gratuito e da plataforma Dupply Atende — responsabilidades, canais de mensagem, uso de IA e limites do serviço.',
    indexable: true,
    changefreq: 'monthly',
    priority: '0.3',
  },
  {
    path: EXCLUSAO_DADOS_PATH,
    title: `Exclusão de dados | ${SITE_NAME}`,
    description:
      'Como solicitar a exclusão dos seus dados na Dupply, incluindo dados obtidos das plataformas Instagram e WhatsApp através do Dupply Atende.',
    indexable: true,
    changefreq: 'monthly',
    priority: '0.3',
  },
  {
    path: DIAGNOSTICO_TEST_PATH,
    title: `Diagnóstico (teste) | ${SITE_NAME}`,
    description: 'Página interna de teste do diagnóstico.',
    indexable: false,
  },
]

export function routeSeo(path: string): RouteSeo {
  const found = ROUTES_SEO.find((route) => route.path === path)
  if (!found) throw new Error(`Rota sem SEO declarado em ROUTES_SEO: ${path}`)
  return found
}

/** Rota inexistente: renderizada pela SPA, mas nunca indexável. */
export const NOT_FOUND_SEO: RouteSeo = {
  path: '/404',
  title: `Página não encontrada | ${SITE_NAME}`,
  description: 'A página que você procura não existe ou foi movida.',
  indexable: false,
}
