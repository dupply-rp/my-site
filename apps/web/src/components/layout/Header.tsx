import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dupplyLogo from '../../assets/dupply-logo-transparent.png'
import { DIAGNOSTICO_PATH, WHATSAPP_URL } from '../../constants/links'

const navItems = [
  { href: '#gargalos', label: 'Soluções' },
  { href: '#atuacao', label: 'Processo' },
  { href: '#beneficios', label: 'Resultados' },
  { href: '#trajetoria', label: 'Sobre' },
  { to: DIAGNOSTICO_PATH, label: 'Diagnóstico', route: true as const },
  { href: WHATSAPP_URL, label: 'Contato', external: true as const },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <header className="topbar">
      <nav className="nav wrap" aria-label="Navegação principal">
        <a className="brand" href="#top" aria-label="Dupply — página inicial">
          <img src={dupplyLogo} alt="" width={120} height={40} />
          <span className="brand-text">
            <span className="brand-name">dupply</span>
            <span className="brand-tagline">Aprenda construindo no mercado real</span>
          </span>
        </a>

        <div className="nav-links nav-links-desktop">
          {navItems.map((item) =>
            'external' in item ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : 'route' in item ? (
              <Link key={item.label} to={item.to!}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ),
          )}
          <Link className="btn btn-primary btn-sm" to={DIAGNOSTICO_PATH}>
            Diagnóstico gratuito
          </Link>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`nav-mobile${menuOpen ? ' is-open' : ''}`}
        hidden={!menuOpen}
        onClick={closeMenu}
        role="presentation"
      >
        <div
          className="nav-mobile-panel"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {navItems.map((item) =>
            'external' in item ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ) : 'route' in item ? (
              <Link key={item.label} to={item.to!} onClick={closeMenu}>
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ),
          )}
          <Link className="btn btn-primary" to={DIAGNOSTICO_PATH} onClick={closeMenu}>
            Diagnóstico gratuito
          </Link>
        </div>
      </div>
    </header>
  )
}
