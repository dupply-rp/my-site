import { Link } from 'react-router-dom'
import { BrandLogo } from '../../../components/BrandLogo'
import { ThemeToggle } from '../../../components/ThemeToggle'

interface DiagnosticoTopbarProps {
  showBack?: boolean
  backTo?: string
  backLabel?: string
}

export function DiagnosticoTopbar({
  showBack = true,
  backTo = '/',
  backLabel = '← Voltar ao site',
}: DiagnosticoTopbarProps) {
  return (
    <header className="diag-topbar">
      <div className="diag-container diag-topbar-inner">
        <Link className="brand diag-brand" to="/" aria-label="Dupply — página inicial">
          <BrandLogo />
        </Link>
        <div className="diag-topbar-actions">
          <ThemeToggle />
          {showBack ? (
            <Link className="diag-topbar-link" to={backTo}>
              {backLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
