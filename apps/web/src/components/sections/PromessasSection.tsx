import { heroPromises } from '../../constants/content'
import { IconeX } from '../Icones'

export function PromessasSection() {
  return (
    <section className="dp-sec dp-sec-escura" id="promessas" aria-labelledby="promessas-titulo">
      <div className="dp-wrap">
        <div className="dp-promessas-bloco">
          <p className="dp-eyebrow">Honestidade primeiro</p>
          <h2 className="dp-h2 dp-h2-linha" id="promessas-titulo">
            O que a Dupply não promete.
          </h2>

          <ul className="dp-promessas">
            {heroPromises.map((item) => (
              <li key={item}>
                <IconeX />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
