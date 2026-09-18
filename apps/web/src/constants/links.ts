export const WHATSAPP_PHONE = '(77) 99951-8373'
const WHATSAPP_NUMERO = '5577999518373'

/** Mensagem pré-preenchida por origem, para separar lead novo de cliente pedindo suporte. */
export const MENSAGENS_WHATSAPP = {
  heroi: 'Olá! Vim pelo site da Dupply e quero entender como a IA entra na minha operação.',
  fecho: 'Olá! Vim pelo site da Dupply e quero conversar sobre o meu caso.',
  diagnostico:
    'Olá! Vim através do diagnóstico de IA da Dupply e gostaria de falar com um especialista.',
  instagram: 'Olá! Vim pelo Instagram do Ricardo.',
  suporte: 'Olá! Sou cliente da Dupply e preciso de suporte.',
} as const

export type OrigemWhatsApp = keyof typeof MENSAGENS_WHATSAPP

export function whatsappUrl(origem: OrigemWhatsApp = 'heroi'): string {
  return 'https://wa.me/' + WHATSAPP_NUMERO + '?text=' + encodeURIComponent(MENSAGENS_WHATSAPP[origem])
}

export function whatsappProduto(produto: string): string {
  return (
    'https://wa.me/' +
    WHATSAPP_NUMERO +
    '?text=' +
    encodeURIComponent('Olá! Vim pelo site e quero saber sobre o Dupply ' + produto + '.')
  )
}

/** Mantida para as páginas que ainda não foram redesenhadas. */
export const WHATSAPP_URL = whatsappUrl('diagnostico')

export const DIAGNOSTICO_PATH = '/diagnostico'
export const DIAGNOSTICO_TEST_PATH = '/TC_teste'
export const PRIVACIDADE_PATH = '/privacidade'
export const TERMOS_PATH = '/termos'
export const EXCLUSAO_DADOS_PATH = '/exclusao-de-dados'

/** Contato para solicitações LGPD / privacidade. */
export const PRIVACY_EMAIL = 'ricardo.lima@dupply.com.br'

/** Produto de atendimento multicanal (WhatsApp, Instagram). */
export const ATENDE_URL = 'https://atende.dupply.com.br'
