import { heroPromises } from '../../constants/content'

export function PromessasSection() {
  return (
    <section className="dp-sec dp-sec-escura" id="promessas" aria-labelledby="promessas-titulo">
      <div className="dp-wrap">
        <div className="dp-cabecalho">
          <div>
            <p className="dp-eyebrow">Honestidade primeiro</p>
            <h2 className="dp-h2" id="promessas-titulo">
              O que a Dupply não promete.
            </h2>
          </div>
        </div>

        <div className="dp-promessas">
          {heroPromises.map((item) => (
            <div className="dp-promessa" key={item}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
