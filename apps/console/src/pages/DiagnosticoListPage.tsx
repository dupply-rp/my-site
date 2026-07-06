import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { Layout } from '../components/Layout'
import type { DiagnosticoListItem } from '../lib/api'
import {
  fetchDiagnosticos,
  formatDate,
  scoreBadgeClass,
} from '../lib/api'

export function DiagnosticoListPage() {
  const [items, setItems] = useState<DiagnosticoListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDiagnosticos()
      .then(setItems)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout title="Diagnósticos" subtitle="Leads e respostas salvos no Postgres">
      {loading ? <p className="muted">Carregando…</p> : null}
      {error ? <p className="error">{error}</p> : null}

      {!loading && !error && items.length === 0 ? (
        <div className="card empty-state">
          <h2>Nenhum diagnóstico ainda</h2>
          <p className="muted">
            Quando alguém responder o quiz em dupply.com.br/diagnostico, o registro aparece aqui.
          </p>
        </div>
      ) : null}

      {!loading && items.length > 0 ? (
        <div className="card table-card">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Empresa</th>
                <th>Score</th>
                <th>Setor</th>
                <th>Contato</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <strong>{item.empresa}</strong>
                    <div className="muted table-sub">{item.porte ?? '—'}</div>
                  </td>
                  <td>
                    <span className={`badge ${scoreBadgeClass(item.scoreLabel)}`}>
                      {item.score} · {item.scoreLabel}
                    </span>
                  </td>
                  <td>{item.setor ?? '—'}</td>
                  <td>
                    <div>{item.email ?? '—'}</div>
                    <div className="muted table-sub">{item.telefone ?? '—'}</div>
                  </td>
                  <td className="table-action">
                    <Link to={`/diagnosticos/${item.id}`}>Ver detalhe</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <style>{`
        .empty-state {
          padding: 32px;
        }

        .empty-state h2 {
          margin: 0 0 8px;
        }

        .table-card {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        th,
        td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
          text-align: left;
          vertical-align: top;
        }

        th {
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--muted);
          background: var(--surface-2);
        }

        .table-sub {
          font-size: 0.86rem;
          margin-top: 4px;
        }

        .table-action a {
          color: var(--blue);
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>
    </Layout>
  )
}
