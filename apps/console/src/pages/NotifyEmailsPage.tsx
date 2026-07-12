import { useEffect, useMemo, useState, type FormEvent } from 'react'

import {
  ConsoleApiError,
  ConsoleClient,
  formatDiagnosticoDate,
  type NotifyEmailItem,
} from '@dupply/sdk'

import { AppShell } from '../components/AppShell'

const client = new ConsoleClient(ConsoleClient.getStoredToken())

export function NotifyEmailsPage() {
  const [items, setItems] = useState<NotifyEmailItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [label, setLabel] = useState('')
  const [saving, setSaving] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function loadItems() {
    setLoading(true)
    setError(null)
    try {
      const data = await client.listNotifyEmails()
      setItems(data)
    } catch (err) {
      setError(err instanceof ConsoleApiError ? err.message : 'Erro ao carregar e-mails')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadItems()
  }, [])

  const subtitle = useMemo(() => {
    if (loading) return 'Carregando destinatários…'
    return `${items.length} e-mail(s) recebem alerta de novo diagnóstico`
  }, [items.length, loading])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return

    setSaving(true)
    setError(null)
    try {
      const item = await client.addNotifyEmail(email, label)
      setItems((current) => {
        const exists = current.some((entry) => entry.id === item.id)
        if (exists) {
          return current.map((entry) => (entry.id === item.id ? item : entry))
        }
        return [...current, item]
      })
      setEmail('')
      setLabel('')
    } catch (err) {
      setError(err instanceof ConsoleApiError ? err.message : 'Erro ao cadastrar e-mail')
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id)
    setError(null)
    try {
      await client.removeNotifyEmail(id)
      setItems((current) => current.filter((item) => item.id !== id))
    } catch (err) {
      setError(err instanceof ConsoleApiError ? err.message : 'Erro ao remover e-mail')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <AppShell title="E-mails de notificação" subtitle={subtitle}>
      <div className="notify-emails-grid">
        <section className="card notify-emails-form-card">
          <h2>Cadastrar e-mail</h2>
          <p className="muted">
            Estes endereços recebem um alerta sempre que alguém concluir o diagnóstico no site.
          </p>

          <form className="notify-emails-form" onSubmit={handleSubmit}>
            <label>
              <span>E-mail</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nome@empresa.com"
                required
              />
            </label>

            <label>
              <span>Descrição (opcional)</span>
              <input
                type="text"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Ex.: Comercial, Ricardo"
              />
            </label>

            <button type="submit" className="btn btn-secondary" disabled={saving}>
              {saving ? 'Salvando…' : 'Adicionar e-mail'}
            </button>
          </form>
        </section>

        <section className="card table-card">
          {error ? <p className="error notify-emails-error">{error}</p> : null}

          {loading ? <p className="muted notify-emails-loading">Carregando…</p> : null}

          {!loading && items.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhum e-mail cadastrado</h2>
              <p className="muted">Adicione pelo menos um destinatário para receber os alertas.</p>
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>E-mail</th>
                  <th>Descrição</th>
                  <th>Cadastrado em</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.email}</strong>
                    </td>
                    <td>{item.label ?? '—'}</td>
                    <td>{formatDiagnosticoDate(item.createdAt)}</td>
                    <td className="table-action">
                      <button
                        type="button"
                        className="btn btn-secondary notify-emails-remove"
                        onClick={() => void handleRemove(item.id)}
                        disabled={removingId === item.id}
                      >
                        {removingId === item.id ? 'Removendo…' : 'Remover'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      </div>

      <style>{`
        .notify-emails-grid {
          display: grid;
          gap: 20px;
        }

        .notify-emails-form-card {
          padding: 24px;
        }

        .notify-emails-form-card h2 {
          margin: 0 0 8px;
          font-size: 1.15rem;
        }

        .notify-emails-form-card .muted {
          margin: 0 0 20px;
        }

        .notify-emails-form {
          display: grid;
          gap: 14px;
          max-width: 420px;
        }

        .notify-emails-form label {
          display: grid;
          gap: 6px;
          font-weight: 600;
          font-size: 0.92rem;
        }

        .notify-emails-form input {
          min-height: 44px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
        }

        .notify-emails-error {
          margin: 16px 16px 0;
        }

        .notify-emails-loading,
        .empty-state {
          padding: 24px;
        }

        .empty-state h2 {
          margin: 0 0 8px;
          font-size: 1.1rem;
        }

        .notify-emails-remove {
          min-height: 40px;
          padding: 0 14px;
          font-size: 0.92rem;
        }

        @media (min-width: 960px) {
          .notify-emails-grid {
            grid-template-columns: 360px 1fr;
            align-items: start;
          }
        }
      `}</style>
    </AppShell>
  )
}
