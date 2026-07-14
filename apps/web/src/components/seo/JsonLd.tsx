import { SITE_DESCRIPTION, SITE_NAME, SITE_OG_DESCRIPTION, SITE_TITLE, SITE_URL } from '../../constants/site'
import { WHATSAPP_URL } from '../../constants/links'

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/og-image.png`,
      description: SITE_DESCRIPTION,
      sameAs: [
        'https://www.instagram.com/dupplybr',
        'https://linkedin.com/company/dupplybr',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Portuguese'],
        url: WHATSAPP_URL,
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Vitória da Conquista',
        addressRegion: 'BA',
        addressCountry: 'BR',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'pt-BR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_OG_DESCRIPTION,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'pt-BR',
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#service`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: 'BR',
      serviceType: [
        'Consultoria em inteligência artificial',
        'Automação de processos',
        'Integração de sistemas',
      ],
    },
  ],
}

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
