import type { Answers } from '@dupply/types/diagnostico'

import { allQuestions } from './questions'

const TEST_COMPANY_NAMES = [
  'Mercado Norte',
  'Clínica Horizonte',
  'Logística Rápida',
  'Studio Criativo',
  'Distribuidora Vale',
  'Tech Soluções',
  'Padaria Central',
  'Consultoria Atlas',
]

const TEST_CONTEXTS = [
  'Operamos com 12 pessoas e perdemos horas confirmando pedidos no WhatsApp. Planilhas não conversam com o financeiro e cada vendedor segue um processo diferente para follow-up.',
  'Somos uma clínica com duas unidades. A agenda é manual, o time repete as mesmas orientações por mensagem e não temos visão clara de faltas e receita por profissional.',
  'E-commerce em crescimento com estoque controlado em planilha. Demora para gerar relatórios de vendas e o atendimento pós-compra é quase todo manual.',
  'Indústria enxuta: pedidos chegam por e-mail e WhatsApp, entram no ERP com atraso e a produção descobre mudanças em cima da hora.',
  'Escritório de serviços com muito retrabalho em propostas e contratos. Queremos automatizar triagem de leads e respostas frequentes sem perder qualidade.',
]

function pickOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

function pickManyLabels(labels: string[], min: number, max: number): string[] {
  const count = Math.min(labels.length, min + Math.floor(Math.random() * (max - min + 1)))
  return [...labels].sort(() => Math.random() - 0.5).slice(0, count)
}

function randomPhoneDigits(): string {
  const suffix = String(Math.floor(Math.random() * 100_000_000)).padStart(8, '0')
  return `77${9}${suffix}`
}

/** Respostas aleatórias para o fluxo /TC_teste — empresa sempre com prefixo TC_. */
export function createRandomTestAnswers(): Answers {
  const stamp = Date.now().toString(36)
  const answers: Answers = {
    nome: `TC_${pickOne(TEST_COMPANY_NAMES)} ${stamp}`,
    email: `tc-test+${stamp}@dupply.com.br`,
    telefone: randomPhoneDigits(),
  }

  for (const question of allQuestions) {
    if (question.type === 'contact') continue

    if (question.type === 'select') {
      answers[question.id] = pickOne(question.options)
      continue
    }

    if (question.type === 'single') {
      answers[question.id] = pickOne(question.options).l
      continue
    }

    if (question.type === 'multi') {
      const labels = question.options.map((option) => option.l)
      answers[question.id] = pickManyLabels(labels, 1, Math.min(3, labels.length))
      continue
    }

    if (question.type === 'textarea') {
      answers[question.id] = pickOne(TEST_CONTEXTS)
    }
  }

  return answers
}
