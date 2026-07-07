import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { ConsoleClient } from '@dupply/sdk'

interface AppShellProps {
  title: string
  subtitle?: string
  children: ReactNode
}

const navItems = [{ to: '/', label: 'Diagnósticos', end: true }]

export function AppShell({ title, subtitle, children }: AppShellProps) {
  const navigate = useNavigate()

  function handleLogout() {
    ConsoleClient.clearStoredToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="app-shell-sidebar">
        <div className="app-shell-brand">
          <span className="app-shell-eyebrow">Dupply</span>
          <strong>Console</strong>
        </div>

        <nav className="app-shell-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `app-shell-nav-link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="app-shell-logout" onClick={handleLogout}>
          Sair
        </button>
      </aside>

      <div className="app-shell-main">
        <header className="app-shell-header">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
        </header>
        <div className="app-shell-content">{children}</div>
      </div>

      <style>{`
        .app-shell {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 240px 1fr;
        }

        .app-shell-sidebar {
          border-right: 1px solid var(--line);
          background: #fff;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .app-shell-brand {
          padding: 0 8px;
        }

        .app-shell-eyebrow {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--blue);
          margin-bottom: 4px;
        }

        .app-shell-nav {
          display: grid;
          gap: 6px;
        }

        .app-shell-nav-link {
          padding: 10px 12px;
          border-radius: 8px;
          color: var(--muted);
          font-weight: 600;
        }

        .app-shell-nav-link.is-active {
          background: var(--blue-soft);
          color: var(--blue);
        }

        .app-shell-logout {
          margin-top: auto;
          border: 1px solid var(--line);
          background: #fff;
          border-radius: 8px;
          padding: 10px 12px;
          font-weight: 600;
        }

        .app-shell-main {
          min-width: 0;
        }

        .app-shell-header {
          padding: 24px 32px 0;
        }

        .app-shell-header h1 {
          margin: 0;
          font-size: 1.6rem;
        }

        .app-shell-header .muted {
          margin: 6px 0 0;
        }

        .app-shell-content {
          padding: 20px 32px 40px;
        }

        @media (max-width: 900px) {
          .app-shell {
            grid-template-columns: 1fr;
          }

          .app-shell-sidebar {
            border-right: 0;
            border-bottom: 1px solid var(--line);
          }
        }
      `}</style>
    </div>
  )
}
