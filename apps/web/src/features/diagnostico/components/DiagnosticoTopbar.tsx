import { Link } from 'react-router-dom'
import dupplyLogo from '../../../assets/dupply-logo-transparent.png'

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
          <img src={dupplyLogo} alt="Dupply" width={300} height={82} />
        </Link>
        {showBack ? (
          <Link className="diag-topbar-link" to={backTo}>
            {backLabel}
          </Link>
        ) : null}
      </div>
    </header>
  )
}
