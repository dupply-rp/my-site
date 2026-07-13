import { BrandLogo } from '../../../components/BrandLogo'

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

interface IntroScreenProps {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="diag-intro">
      <div className="diag-logo-mark">
        <BrandLogo className="diag-logo-img" />
      </div>

      <span className="eyebrow diag-intro-eyebrow">Diagnóstico Gratuito · ~5 minutos</span>

      <h1 className="diag-hero-title">
        Descubra como a <span>IA pode transformar</span> sua empresa
      </h1>

      <p className="diag-hero-sub">
        Responda perguntas sobre suas operações e receba um relatório personalizado com oportunidades reais de
        automação e inteligência artificial. Depois da maior dor, você pode descrever seu negócio com suas próprias palavras.
      </p>

      <div className="diag-hero-meta">
        <div className="diag-meta-item">
          <span className="diag-meta-icon" aria-hidden>⏱</span>
          <span>Menos de 5 minutos</span>
        </div>
        <div className="diag-meta-item">
          <span className="diag-meta-icon" aria-hidden>📊</span>
          <span>Relatório gerado com IA</span>
        </div>
        <div className="diag-meta-item">
          <span className="diag-meta-icon" aria-hidden>🎯</span>
          <span>100% personalizado</span>
        </div>
      </div>

      <button type="button" className="btn btn-primary diag-btn-lg" onClick={onStart}>
        Iniciar Diagnóstico
        <ArrowIcon />
      </button>
    </div>
  )
}
