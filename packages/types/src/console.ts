export interface DiagnosticoListItem {
  id: string
  createdAt: string
  empresa: string
  email: string | null
  telefone: string | null
  score: number
  scoreLabel: string
  setor: string | null
  porte: string | null
  aiGenerated: boolean
}

export interface DiagnosticoDetail extends DiagnosticoListItem {
  faturamento: string | null
  maiorDor: string | null
  budget: string | null
  objetivo: string | null
  relatorio: string | null
  respostas: Array<{
    id: string
    perguntaId: string
    perguntaTexto: string
    resposta: string
  }>
}

export interface ConsoleAuthResponse {
  ok: boolean
  token?: string
  tenantSlug?: string
  error?: string
}

export interface ConsoleDiagnosticosResponse {
  items: DiagnosticoListItem[]
  total: number
  tenantSlug?: string
  error?: string
}

export interface ConsoleDiagnosticoResponse {
  diagnostico: DiagnosticoDetail
  error?: string
}
