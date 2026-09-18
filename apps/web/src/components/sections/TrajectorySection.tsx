import { companies } from '../../constants/content'

export function TrajectorySection() {
  return (
    <section className="dp-autoridade" id="trajetoria" aria-labelledby="trajetoria-titulo">
      <div className="dp-wrap">
        <p className="dp-eyebrow" id="trajetoria-titulo">
          Antes da Dupply, eu entreguei projeto para
        </p>
        <ul className="dp-logos">
          {companies.map((company) => (
            <li key={company.id}>{company.name}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
