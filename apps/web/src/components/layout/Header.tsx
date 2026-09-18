import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import assinaturaClara from '../../assets/marca/dupply-assinatura-clara.svg'
import assinaturaEscura from '../../assets/marca/dupply-assinatura-escura.svg'
import { DIAGNOSTICO_PATH } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'

const navItems = [
  { href: '/#solucoes', label: 'Soluções' },
  { href: '/#atuacao', label: 'Como funciona' },
  { href: '/#trajetoria', label: 'Sobre' },
] as const

interface HeaderProps {
  /** Na home o topo começa transparente sobre o herói escuro. Nas outras páginas, não. */
  sobreEscuro?: boolean
}

export function Header({ sobreEscuro = false }: HeaderProps = {}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [rolou, setRolou] = useState(!sobreEscuro)

  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    if (!sobreEscuro) return
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [sobreEscuro])

  const classe = rolou ? 'dp-topo dp-topo-solido' : 'dp-topo'

  return (
    <header className={classe}>
      <nav className="dp-topo-nav dp-wrap" aria-label="Navegação principal">
        <Link className="dp-topo-marca" to="/" aria-label="Dupply, página inicial">
          <img src={rolou ? assinaturaEscura : assinaturaClara} alt="Dupply" height={34} />
        </Link>

        <div className="dp-topo-links">
          {navItems.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
          <Link
            className="dp-topo-btn"
            to={DIAGNOSTICO_PATH}
            onClick={() =>
              trackCtaClick('diagnostico_gratuito', {
                location: 'topo',
                destination: DIAGNOSTICO_PATH,
              })
            }
          >
            Diagnóstico gratuito
          </Link>
        </div>

        <button
          type="button"
          className="dp-topo-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={menuOpen ? 'dp-menu dp-menu-aberto' : 'dp-menu'}
        hidden={!menuOpen}
        onClick={closeMenu}
        role="presentation"
      >
        <div
          className="dp-menu-painel"
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <Link
            className="dp-btn dp-btn-primary"
            to={DIAGNOSTICO_PATH}
            onClick={() => {
              trackCtaClick('diagnostico_gratuito', {
                location: 'topo_celular',
                destination: DIAGNOSTICO_PATH,
              })
              closeMenu()
            }}
          >
            Diagnóstico gratuito
          </Link>
        </div>
      </div>
    </header>
  )
}
