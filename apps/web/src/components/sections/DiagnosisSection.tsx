import { dores } from '../../constants/content'

export function DiagnosisSection() {
  return (
    <section className="dp-sec dp-sec-branca" id="gargalos" aria-labelledby="gargalos-titulo">
      <div className="dp-wrap">
        <div className="dp-cabecalho">
          <div>
            <p className="dp-eyebrow">O problema</p>
            <h2 className="dp-h2" id="gargalos-titulo">
              Onde sua empresa está perdendo tempo hoje.
            </h2>
          </div>
          <p className="dp-lead">
            Antes de falar em tecnologia, a gente olha a operação. O desperdício quase sempre está
            em tarefa pequena, repetida e invisível.
          </p>
        </div>

        <div className="dp-grid-3">
          {dores.map((dor) => (
            <article className="dp-card-dor" key={dor.titulo}>
              <h3>{dor.titulo}</h3>
              <p>{dor.saida}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
