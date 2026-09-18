import { CompanyIcon } from '../CompanyIcon'
import { companies } from '../../constants/content'

export function TrajectorySection() {
  return (
    <section className="dp-autoridade" id="trajetoria" aria-labelledby="trajetoria-titulo">
      <div className="dp-wrap">
        <p className="dp-eyebrow" id="trajetoria-titulo">
          Onde eu trabalhei e entreguei projetos antes da Dupply
        </p>
        <div className="dp-logos">
          {companies.map((company) => (
            <CompanyIcon key={company.id} id={company.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
