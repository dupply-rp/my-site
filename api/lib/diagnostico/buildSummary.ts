import type { Answers } from './types'

const CONTEXT_MAX_CHARS = 800

const FIELD_LABELS: Record<string, string> = {
  nome: 'empresa',
  setor: 'setor',
  porte: 'porte',
  faturamento: 'faturamento',
  processos_manuais: 'processos_manuais',
  tempo_desperdicado: 'tempo_repetitivo',
  sistemas: 'sistemas',
  atendimento: 'atendimento',
  decisoes: 'decisoes',
  dados_disponiveis: 'dados',
  maior_dor: 'maior_dor',
  experiencia_ia: 'maturidade_ia',
  budget: 'budget_ia',
}

function formatValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join('; ') : value
}

export function buildSummary(answers: Answers): string {
  const lines: string[] = []

  for (const [key, label] of Object.entries(FIELD_LABELS)) {
    const answer = answers[key]
    if (!answer || (Array.isArray(answer) && answer.length === 0)) continue
    lines.push(`${label}: ${formatValue(answer as string | string[])}`)
  }

  const body = lines.join('\n')
  const contexto = String(answers.contexto_negocio ?? '').trim()
  if (!contexto) return body

  const trimmed =
    contexto.length > CONTEXT_MAX_CHARS ? `${contexto.slice(0, CONTEXT_MAX_CHARS)}…` : contexto

  return `${body}\n\n--- CONTEXTO EM ABERTO DO EMPRESÁRIO (PRIORIZE) ---\n${trimmed}`
}
