import type { FormEvent } from 'react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { getConsoleToken, login } from '../lib/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (getConsoleToken()) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <div className="container">
        <div className="card login-card">
          <p className="login-eyebrow">Dupply</p>
          <h1>Console interno</h1>
          <p className="muted">Consulte diagnósticos salvos no banco de dados.</p>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="password">Senha de acesso</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite a senha do console"
              autoComplete="current-password"
              required
            />

            {error ? <p className="error">{error}</p> : null}

            <button type="submit" disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 32px 0;
        }

        .login-card {
          padding: 32px;
          max-width: 420px;
          margin: 0 auto;
        }

        .login-eyebrow {
          margin: 0 0 8px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue);
        }

        .login-card h1 {
          margin: 0 0 8px;
          font-size: 1.8rem;
        }

        .login-card > .muted {
          margin: 0 0 24px;
        }

        .login-form {
          display: grid;
          gap: 10px;
        }

        .login-form label {
          font-size: 0.92rem;
          font-weight: 600;
        }

        .login-form input {
          width: 100%;
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 12px 14px;
          background: #fff;
        }

        .login-form button {
          margin-top: 8px;
          border: 0;
          border-radius: 8px;
          padding: 12px 16px;
          background: var(--blue);
          color: #fff;
          font-weight: 600;
        }

        .login-form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  )
}
