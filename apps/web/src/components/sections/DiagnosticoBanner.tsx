import { Link } from 'react-router-dom'
import { DIAGNOSTICO_PATH } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'

export function DiagnosticoBanner() {
  return (
    <section className="section diag-banner" aria-labelledby="diag-banner-heading">
      <div className="wrap">
        <div className="diag-banner-box">
          <div>
            <span className="eyebrow">Diagnóstico gratuito</span>
            <h2 id="diag-banner-heading">Descubra em ~5 minutos onde a IA pode gerar valor na sua empresa</h2>
            <p>
              Responda um questionário rápido e receba um relatório personalizado com score de maturidade,
              oportunidades de automação e um roadmap prático.
            </p>
            <div className="diag-banner-meta" role="list" aria-label="Benefícios do diagnóstico">
              <span role="listitem">⏱ ~5 min</span>
              <span role="listitem">📊 Relatório com IA</span>
              <span role="listitem">🎯 100% gratuito</span>
            </div>
          </div>
          <Link
            className="btn btn-primary"
            to={DIAGNOSTICO_PATH}
            onClick={() =>
              trackCtaClick('diagnostico_gratuito', {
                location: 'banner',
                destination: DIAGNOSTICO_PATH,
              })
            }
          >
            Fazer diagnóstico gratuito
          </Link>
        </div>
      </div>
    </section>
  )
}
