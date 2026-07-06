import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { clearConsoleToken } from '../lib/api'

interface LayoutProps {
  title: string
  subtitle?: string
  backTo?: string
  children: ReactNode
}

export function Layout({ title, subtitle, backTo, children }: LayoutProps) {
  const navigate = useNavigate()

  function handleLogout() {
    clearConsoleToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container layout-header-inner">
          <div>
            {backTo ? (
              <Link to={backTo} className="back-link">
                ← Voltar
              </Link>
            ) : null}
            <p className="layout-eyebrow">Dupply Console</p>
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          <button type="button" className="logout-btn" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="container layout-main">{children}</main>

      <style>{`
        .layout-header {
          border-bottom: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .layout-header-inner {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 24px 0;
        }

        .layout-eyebrow {
          margin: 0 0 4px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue);
        }

        .layout-header h1 {
          margin: 0;
          font-size: 1.6rem;
        }

        .layout-header .muted {
          margin: 6px 0 0;
        }

        .back-link {
          display: inline-block;
          margin-bottom: 8px;
          color: var(--blue);
          font-weight: 600;
          font-size: 0.92rem;
        }

        .logout-btn {
          border: 1px solid var(--line);
          background: #fff;
          border-radius: 8px;
          padding: 10px 14px;
          font-weight: 600;
        }

        .layout-main {
          padding: 24px 0 48px;
        }
      `}</style>
    </div>
  )
}
