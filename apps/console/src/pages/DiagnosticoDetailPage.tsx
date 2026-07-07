import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  ConsoleApiError,
  ConsoleClient,
  formatDiagnosticoDate,
  scoreBadgeClass,
  type DiagnosticoDetail,
} from '@dupply/sdk'

import { AppShell } from '../components/AppShell'

const client = new ConsoleClient(ConsoleClient.getStoredToken())

export function DiagnosticoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<DiagnosticoDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    client
      .getDiagnostico(id)
      .then(setData)
      .catch((err) => {
        setError(err instanceof ConsoleApiError ? err.message : 'Erro ao carregar')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AppShell title="Carregando…" subtitle="Buscando diagnóstico">
        <p className="muted">Aguarde…</p>
      </AppShell>
    )
  }

  if (error || !data) {
    return (
      <AppShell title="Erro" subtitle="Não foi possível carregar">
        <p className="error">{error ?? 'Diagnóstico não encontrado'}</p>
        <p>
          <Link to="/">Voltar para a lista</Link>
        </p>
      </AppShell>
    )
  }

  return (
    <AppShell title={data.empresa} subtitle={formatDiagnosticoDate(data.createdAt)}>
      <div className="detail-grid">
        <section className="card detail-card">
          <h2>Resumo</h2>
          <div className="summary-row">
            <span className={`badge ${scoreBadgeClass(data.scoreLabel)}`}>
              {data.score} · {data.scoreLabel}
            </span>
            <span className="muted">{data.aiGenerated ? 'Relatório com IA' : 'Relatório padrão'}</span>
          </div>

          <dl className="meta-list">
            <div>
              <dt>E-mail</dt>
              <dd>{data.email ?? '—'}</dd>
            </div>
            <div>
              <dt>Telefone</dt>
              <dd>{data.telefone ?? '—'}</dd>
            </div>
            <div>
              <dt>Setor</dt>
              <dd>{data.setor ?? '—'}</dd>
            </div>
            <div>
              <dt>Porte</dt>
              <dd>{data.porte ?? '—'}</dd>
            </div>
            <div>
              <dt>Faturamento</dt>
              <dd>{data.faturamento ?? '—'}</dd>
            </div>
            <div>
              <dt>Maior dor</dt>
              <dd>{data.maiorDor ?? '—'}</dd>
            </div>
            <div>
              <dt>Budget IA</dt>
              <dd>{data.budget ?? '—'}</dd>
            </div>
            {data.objetivo ? (
              <div className="meta-full">
                <dt>Objetivo / contexto</dt>
                <dd>{data.objetivo}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="card detail-card">
          <h2>Respostas</h2>
          <div className="answers-list">
            {data.respostas.map((item) => (
              <article key={item.id} className="answer-item">
                <h3>{item.perguntaTexto}</h3>
                <p>{item.resposta}</p>
              </article>
            ))}
          </div>
        </section>

        {data.relatorio ? (
          <section className="card detail-card detail-full">
            <h2>Relatório</h2>
            <pre className="report-text">{data.relatorio}</pre>
          </section>
        ) : null}
      </div>

      <p className="back-row">
        <Link to="/">← Voltar para a lista</Link>
      </p>

      <style>{`
        .detail-grid {
          display: grid;
          gap: 20px;
        }

        .detail-card {
          padding: 24px;
        }

        .detail-card h2 {
          margin: 0 0 16px;
          font-size: 1.1rem;
        }

        .summary-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .meta-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px 20px;
          margin: 0;
        }

        .meta-full {
          grid-column: 1 / -1;
        }

        .meta-list dt {
          margin: 0 0 4px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .meta-list dd {
          margin: 0;
          line-height: 1.5;
        }

        .answers-list {
          display: grid;
          gap: 12px;
        }

        .answer-item {
          padding: 14px 0;
          border-bottom: 1px solid var(--line);
        }

        .answer-item:last-child {
          border-bottom: 0;
          padding-bottom: 0;
        }

        .answer-item h3 {
          margin: 0 0 6px;
          font-size: 0.95rem;
          color: var(--muted);
          font-weight: 600;
        }

        .answer-item p {
          margin: 0;
          white-space: pre-wrap;
        }

        .detail-full {
          grid-column: 1 / -1;
        }

        .report-text {
          margin: 0;
          white-space: pre-wrap;
          font-family: inherit;
          line-height: 1.6;
        }

        .back-row {
          margin-top: 20px;
        }

        .back-row a {
          color: var(--blue);
          font-weight: 600;
        }

        @media (max-width: 720px) {
          .meta-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </AppShell>
  )
}
