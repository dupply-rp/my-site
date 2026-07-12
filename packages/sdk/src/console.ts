import type {
  ConsoleAuthResponse,
  ConsoleDiagnosticoResponse,
  ConsoleDiagnosticosResponse,
  ConsoleNotifyEmailDeleteResponse,
  ConsoleNotifyEmailResponse,
  ConsoleNotifyEmailsResponse,
  DiagnosticoDetail,
  DiagnosticoListItem,
  NotifyEmailItem,
} from '@dupply/types/console'

export type { DiagnosticoDetail, DiagnosticoListItem, NotifyEmailItem }

const STORAGE_KEY = 'dupply-console-token'

export class ConsoleApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ConsoleApiError'
    this.status = status
  }
}

export interface ConsoleClientOptions {
  baseUrl?: string
}

export class ConsoleClient {
  private token: string | null
  private readonly baseUrl: string

  constructor(token: string | null = null, options: ConsoleClientOptions = {}) {
    this.token = token
    this.baseUrl = options.baseUrl ?? ''
  }

  static getStoredToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY)
  }

  static clearStoredToken(): void {
    sessionStorage.removeItem(STORAGE_KEY)
  }

  setToken(token: string): void {
    this.token = token
    sessionStorage.setItem(STORAGE_KEY, token)
  }

  async login(password: string): Promise<{ tenantSlug: string }> {
    const response = await fetch(`${this.baseUrl}/api/console/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
      signal: AbortSignal.timeout(10_000),
    })

    const data = (await response.json()) as ConsoleAuthResponse
    if (!response.ok || !data.token) {
      throw new ConsoleApiError(data.error ?? 'Falha no login', response.status)
    }

    this.setToken(data.token)
    return { tenantSlug: data.tenantSlug ?? 'dupply' }
  }

  async listDiagnosticos(): Promise<DiagnosticoListItem[]> {
    const data = await this.apiFetch<ConsoleDiagnosticosResponse>('/api/console/diagnosticos')
    return data.items
  }

  async getDiagnostico(id: string): Promise<DiagnosticoDetail> {
    const data = await this.apiFetch<ConsoleDiagnosticoResponse>(
      `/api/console/diagnosticos?id=${encodeURIComponent(id)}`,
    )
    return data.diagnostico
  }

  async listNotifyEmails(): Promise<NotifyEmailItem[]> {
    const data = await this.apiFetch<ConsoleNotifyEmailsResponse>('/api/console/notify-emails')
    return data.items
  }

  async addNotifyEmail(email: string, label?: string): Promise<NotifyEmailItem> {
    const data = await this.apiFetch<ConsoleNotifyEmailResponse>('/api/console/notify-emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, label: label?.trim() || undefined }),
    })
    return data.item
  }

  async removeNotifyEmail(id: string): Promise<void> {
    await this.apiFetch<ConsoleNotifyEmailDeleteResponse>(
      `/api/console/notify-emails?id=${encodeURIComponent(id)}`,
      { method: 'DELETE' },
    )
  }

  private async apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = this.token ?? ConsoleClient.getStoredToken()
    if (!token) throw new ConsoleApiError('Sessão expirada', 401)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        ...init,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(init.headers ?? {}),
        },
        signal: AbortSignal.timeout(15_000),
      })
    } catch {
      throw new ConsoleApiError(
        'Não foi possível conectar à API. Rode pnpm dev:api em outro terminal (porta 3000).',
        0,
      )
    }

    const data = (await response.json()) as T & { error?: string }
    if (!response.ok) {
      throw new ConsoleApiError(data.error ?? 'Erro na requisição', response.status)
    }

    return data
  }
}

export function formatDiagnosticoDate(value: string): string {
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
