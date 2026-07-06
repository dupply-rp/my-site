const STORAGE_KEY = 'dupply-console-token'

export function getConsoleToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY)
}

export function setConsoleToken(token: string): void {
  sessionStorage.setItem(STORAGE_KEY, token)
}

export function clearConsoleToken(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export async function login(password: string): Promise<void> {
  let response: Response

  try {
    response = await fetch('/api/console/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      signal: AbortSignal.timeout(10_000),
    })
  } catch {
    throw new Error(
      'Não foi possível conectar à API. Rode pnpm dev:api em outro terminal (porta 3000).',
    )
  }

  let data: { error?: string }
  try {
    data = (await response.json()) as { error?: string }
  } catch {
    throw new Error('Resposta inválida da API. Confira se pnpm dev:api está rodando.')
  }

  if (!response.ok) {
    throw new Error(data.error ?? 'Falha no login')
  }

  setConsoleToken(password)
}

async function apiFetch<T>(path: string): Promise<T> {
  const token = getConsoleToken()
  if (!token) throw new Error('Sessão expirada')

  const response = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = (await response.json()) as T & { error?: string }
  if (!response.ok) {
    throw new Error(data.error ?? 'Erro na requisição')
  }

  return data
}

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

export async function fetchDiagnosticos(): Promise<DiagnosticoListItem[]> {
  const data = await apiFetch<{ items: DiagnosticoListItem[] }>('/api/console/diagnosticos')
  return data.items
}

export async function fetchDiagnosticoById(id: string): Promise<DiagnosticoDetail> {
  const data = await apiFetch<{ diagnostico: DiagnosticoDetail }>(
    `/api/console/diagnosticos?id=${encodeURIComponent(id)}`,
  )
  return data.diagnostico
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function scoreBadgeClass(label: string): string {
  const normalized = label.toLowerCase()
  if (normalized.includes('avançado') || normalized.includes('avancado')) return 'badge--success'
  if (normalized.includes('intermediário') || normalized.includes('intermediario')) return 'badge--warning'
  if (normalized.includes('iniciante')) return 'badge--danger'
  return 'badge--neutral'
}
