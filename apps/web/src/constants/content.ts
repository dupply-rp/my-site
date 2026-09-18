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

/* --- Home nova (spec .specs/home-nova.md) --- */

export const metodoCards = [
  {
    titulo: 'Revisão independente',
    frase: 'Quem escreve o código não é quem revisa, e quem revisa não é quem publica.',
  },
  {
    titulo: 'Verificação automática',
    frase: 'Nada entra no ar sem passar por teste que roda sozinho, toda vez.',
  },
  {
    titulo: 'Segredo fora da conversa',
    frase: 'Senha e chave nunca circulam em mensagem, e cada acesso é o mínimo necessário.',
  },
  {
    titulo: 'Seu dado é seu',
    frase: 'Dado de cliente não vira treino de modelo. É regra escrita, e é conferida.',
  },
] as const

export const dores = [
  {
    titulo: 'Conferindo planilhas',
    saida: 'A conferência sai da mão e o número chega pronto, com a origem do dado rastreável.',
  },
  {
    titulo: 'Procurando informações',
    saida: 'Um lugar só para achar, em vez de seis. Quem procura para de perguntar para os outros.',
  },
  {
    titulo: 'Copiando dados entre sistemas',
    saida: 'Integração entre o que você já usa. Ninguém troca de sistema para resolver isso.',
  },
  {
    titulo: 'Dependendo do WhatsApp para tudo',
    saida: 'Atendimento com fila, dono e histórico, no mesmo número que o cliente já usa.',
  },
  {
    titulo: 'Informações espalhadas',
    saida: 'Cadastro único, e o resto puxa dali. Acaba a versão que cada um tem da verdade.',
  },
  {
    titulo: 'Fazendo retrabalho',
    saida: 'O passo que se repete toda semana vira automação, e a pessoa volta para o que pensa.',
  },
] as const

export const produtos = [
  {
    nome: 'Atende',
    descricao:
      'Junta num só painel as conversas de WhatsApp, Instagram e Telegram, com fila para a equipe, funil de vendas e IA que responde ou ajuda a responder.',
    piloto: false,
    nota: '',
  },
  {
    nome: 'Otto',
    descricao:
      'Assistente financeiro que organiza as contas de uma pessoa ou de um pequeno negócio, e responde pelo aplicativo e pelo WhatsApp.',
    piloto: false,
    nota: '',
  },
  {
    nome: 'Congregar',
    descricao:
      'Sistema para a igreja organizar membros, ministérios, escalas de voluntários e tesouraria num lugar só, com aplicativo para os membros.',
    piloto: false,
    nota: '',
  },
  {
    nome: 'Imob',
    descricao:
      'Site próprio de imóveis com a marca da imobiliária, mais um painel para cadastrar imóveis e receber interessados.',
    piloto: false,
    nota: '',
  },
] as const
