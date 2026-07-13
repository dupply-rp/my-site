export const heroPromises = [
  'IA resolve tudo sozinha',
  'Implementação em uma semana',
  'Sem entender seu negócio',
  'Substitui sua equipe',
  'Funciona igual para todos',
  'Basta contratar uma ferramenta',
] as const

export const heroAboutParagraphs = [
  'Somos especialistas em aplicar IA onde ela realmente reduz custo, elimina retrabalho e organiza a operação — não em slides bonitos que nunca viram rotina.',
  'Cada projeto começa pelo diagnóstico: entendemos como sua empresa funciona hoje, onde o tempo se perde e qual solução faz sentido para o seu contexto.',
  'Da automação de processos à integração entre sistemas, construímos com sua equipe e acompanhamos até a solução funcionar no dia a dia.',
] as const

export const heroProofItems = [
  'Diagnóstico antes de ferramenta',
  'Mapeamento do processo real',
  'Soluções sob medida',
  'Integração entre sistemas existentes',
  'Implementação com sua equipe',
  'Acompanhamento contínuo',
] as const

export const lossItems = [
  'Conferindo planilhas',
  'Procurando informações',
  'Copiando dados entre sistemas',
  'Dependendo do WhatsApp para tudo',
  'Informações espalhadas',
  'Fazendo retrabalho',
] as const

export type CompanyId =
  | 'itau'
  | 'santander'
  | 'neon'
  | 'toro'
  | 'pravaler'
  | 'claro'
  | 'boticario'
  | 'rdstation'
  | 'totvs'

export const companies: ReadonlyArray<{ id: CompanyId; name: string }> = [
  { id: 'itau', name: 'Itaú' },
  { id: 'santander', name: 'Santander' },
  { id: 'neon', name: 'Neon' },
  { id: 'toro', name: 'Toro Investimentos' },
  { id: 'pravaler', name: 'Pravaler' },
  { id: 'claro', name: 'Claro' },
  { id: 'boticario', name: 'Grupo Boticário' },
  { id: 'rdstation', name: 'RD Station' },
  { id: 'totvs', name: 'TOTVS' },
]

export const processSteps = [
  {
    title: 'Diagnóstico',
    description: 'Entendimento do problema, do contexto e do impacto no negócio.',
  },
  {
    title: 'Mapeamento dos processos',
    description: 'Leitura clara do fluxo atual, dos dados e das dependências.',
  },
  {
    title: 'Construção da solução',
    description: 'Desenho e desenvolvimento da automação certa para a realidade da empresa.',
  },
  {
    title: 'Implementação',
    description: 'Colocação da solução em uso, com cuidado para adoção e continuidade.',
  },
  {
    title: 'Acompanhamento',
    description: 'Ajustes, evolução e melhoria contínua a partir do uso real.',
  },
] as const

export const benefits = [
  'Mais produtividade',
  'Menos retrabalho',
  'Dados organizados',
  'Sistemas integrados',
  'Mais rentabilidade',
  'Decisões mais inteligentes',
] as const
