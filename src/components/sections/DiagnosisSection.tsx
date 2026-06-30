import { Link } from 'react-router-dom'
import { lossItems } from '../../constants/content'
import { DIAGNOSTICO_PATH } from '../../constants/links'

export function DiagnosisSection() {
  return (
    <section className="section" id="gargalos">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Diagnóstico</span>
            <h2>Onde sua empresa está perdendo tempo hoje?</h2>
          </div>
          <p>
            Antes de falar em tecnologia, a Dupply olha para a operação. O desperdício quase sempre
            aparece em tarefas pequenas, repetidas e invisíveis.
          </p>
        </div>

        <div className="card-grid">
          {lossItems.map((title, index) => (
            <article className="loss-card" key={title}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{title}</h3>
            </article>
          ))}
        </div>

        <div className="section-cta">
          <Link className="btn btn-primary" to={DIAGNOSTICO_PATH}>
            Fazer diagnóstico gratuito de IA
          </Link>
        </div>
      </div>
    </section>
  )
}
