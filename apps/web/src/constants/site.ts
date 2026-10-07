// `import.meta.env` não existe quando este módulo é lido pelo vite.config (Node),
// que reaproveita as constantes para gerar o HTML estático de cada rota.
const viteEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env

export const SITE_URL = viteEnv?.VITE_SITE_URL ?? 'https://dupply.com.br'

export const SITE_NAME = 'Dupply'

export const SITE_TITLE = 'Dupply | Método para a IA funcionar na sua operação'

export const SITE_DESCRIPTION =
  '21 anos fazendo tecnologia funcionar em operação que não pode parar. A Dupply leva esse método para a sua empresa, e a IA vem junto. Diagnóstico gratuito.'

export const SITE_OG_DESCRIPTION =
  'O que falta na sua operação não é mais uma ferramenta de IA. É método por trás dela.'

export const SITE_LOCALE = 'pt_BR'

export const SITE_KEYWORDS = [
  'inteligência artificial',
  'automação de processos',
  'IA para empresas',
  'consultoria em IA',
  'Dupply',
  'transformação digital',
  'integração de sistemas',
].join(', ')

export const DIAGNOSTICO_TITLE =
  'Diagnóstico gratuito de IA | Dupply — maturidade digital em ~5 minutos'

export const DIAGNOSTICO_DESCRIPTION =
  'Responda um questionário rápido e receba um relatório personalizado com score de maturidade, oportunidades de automação e roadmap prático. 100% gratuito.'
