import type { Answers } from '../../../packages/types/src/diagnostico.ts'

export function createSmokeAnswers(): Answers {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')

  return {
    nome: `Smoke Test Dupply ${stamp}`,
    email: `smoke+${stamp}@dupply.com.br`,
    telefone: '77999887766',
    setor: 'Tecnologia / Software',
    porte: '2 a 10 pessoas',
    faturamento: 'R$ 50k a R$ 200k',
    processos_manuais: ['Lançamento de dados em planilhas', 'Resposta a e-mails repetitivos'],
    tempo_desperdicado: '5 a 15 horas',
    sistemas: ['Planilhas (Excel/Sheets)', 'WhatsApp Business'],
    atendimento: 'Telefone / WhatsApp manual',
    decisoes: 'Com base em relatórios manuais',
    dados_disponiveis: ['Dados financeiros', 'Histórico de clientes'],
    maior_dor: 'Falta de tempo — apagando incêndio',
    contexto_negocio:
      'Somos uma software house com 8 pessoas. Perdemos horas copiando dados entre planilhas e o CRM, e o follow-up comercial depende da memória de cada vendedor.',
    experiencia_ia: 'Estamos explorando',
    budget: 'R$ 500 a R$ 2.000/mês',
  }
}
