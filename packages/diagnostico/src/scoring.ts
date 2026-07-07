import type { Answers, Pillar, ScoreInfo } from '@dupply/types/diagnostico'

export function calcScore(answers: Answers): number {
  let score = 0

  const iaMap: Record<string, number> = {
    'Nunca usamos IA': 0,
    'Estamos explorando': 10,
    'Usamos em algumas áreas': 20,
    'IA faz parte do nosso DNA': 30,
  }
  score += iaMap[String(answers.experiencia_ia)] || 0

  const manuais = Array.isArray(answers.processos_manuais) ? answers.processos_manuais : []
  score += Math.max(0, 20 - manuais.length * 2.5)

  const dados = (Array.isArray(answers.dados_disponiveis) ? answers.dados_disponiveis : []).filter(
    (item) => item !== 'Poucos ou nenhum dado',
  )
  score += Math.min(20, dados.length * 4)

  const decMap: Record<string, number> = {
    'Por intuição e experiência': 0,
    'Com base em relatórios manuais': 5,
    'Com dashboards/BI básico': 12,
    'Com análise avançada de dados': 20,
  }
  score += decMap[String(answers.decisoes)] || 0

  const atMap: Record<string, number> = {
    'Telefone / WhatsApp manual': 0,
    'Misto / sem padrão': 2,
    'Chatbot básico': 7,
    'Sistema de tickets': 10,
  }
  score += atMap[String(answers.atendimento)] || 0

  return Math.min(100, Math.round(score))
}

export function getScoreInfo(score: number): ScoreInfo {
  if (score < 20) {
    return {
      label: 'Iniciante Digital',
      color: '#DC2626',
      desc: 'Sua empresa tem muito espaço para crescer com IA — e isso é uma grande oportunidade.',
    }
  }
  if (score < 40) {
    return {
      label: 'Em Digitalização',
      color: '#D97706',
      desc: 'Você já deu os primeiros passos, mas processos manuais ainda estão freando seu crescimento.',
    }
  }
  if (score < 60) {
    return {
      label: 'Maturidade Crescente',
      color: '#0718ff',
      desc: 'Boa base tecnológica. Com IA nos pontos certos, o impacto pode ser imediato e significativo.',
    }
  }
  if (score < 80) {
    return {
      label: 'Avançado',
      color: '#7C3AED',
      desc: 'Você está à frente da maioria das empresas. IA pode agora turbinar o que já funciona.',
    }
  }
  return {
    label: 'Referência em IA',
    color: '#059669',
    desc: 'Parabéns! Sua empresa já opera com maturidade digital. Hora de ir para o próximo nível.',
  }
}

export function calcPillars(answers: Answers): Pillar[] {
  const manuais = Array.isArray(answers.processos_manuais) ? answers.processos_manuais : []
  const dados = (Array.isArray(answers.dados_disponiveis) ? answers.dados_disponiveis : []).filter(
    (item) => item !== 'Poucos ou nenhum dado',
  )

  const iaMap: Record<string, number> = {
    'Nunca usamos IA': 0,
    'Estamos explorando': 25,
    'Usamos em algumas áreas': 60,
    'IA faz parte do nosso DNA': 100,
  }
  const decMap: Record<string, number> = {
    'Por intuição e experiência': 10,
    'Com base em relatórios manuais': 35,
    'Com dashboards/BI básico': 65,
    'Com análise avançada de dados': 95,
  }
  const atMap: Record<string, number> = {
    'Telefone / WhatsApp manual': 15,
    'Misto / sem padrão': 30,
    'Chatbot básico': 65,
    'Sistema de tickets': 80,
  }

  return [
    { icon: '⚙️', name: 'Automação', score: Math.max(10, 100 - manuais.length * 12) },
    { icon: '📊', name: 'Dados', score: Math.min(95, 10 + dados.length * 17) },
    { icon: '🤖', name: 'Maturidade IA', score: iaMap[String(answers.experiencia_ia)] ?? 5 },
    { icon: '🧠', name: 'Decisões', score: decMap[String(answers.decisoes)] ?? 10 },
    { icon: '💬', name: 'Atendimento', score: atMap[String(answers.atendimento)] ?? 15 },
  ]
}
