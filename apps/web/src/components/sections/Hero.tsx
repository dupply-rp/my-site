import { heroAboutParagraphs, heroProofItems, heroPromises } from '../../constants/content'
import ricardoLima from '../../assets/ricardo-lima.jpg'
import { DIAGNOSTICO_PATH, WHATSAPP_URL } from '../../constants/links'
import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Inteligência Artificial</span>
          <h1 id="hero-heading">
            Cansado de promessas sobre IA que nunca funcionam na prática?
          </h1>
          <p className="hero-lead">
            Sua empresa não precisa de mais um discurso sobre transformação digital. Precisa de
            automação, integração e processos que funcionem no dia a dia.
          </p>
          <p className="hero-highlight">
            A Dupply implementa <strong>IA para resolver problemas reais</strong> — menos promessas,
            mais resultados na operação.
          </p>

          {heroAboutParagraphs.map((paragraph) => (
            <p className="hero-body" key={paragraph}>
              {paragraph}
            </p>
          ))}

          <div className="hero-actions">
            <Link className="btn btn-primary" to={DIAGNOSTICO_PATH}>
              Fazer diagnóstico gratuito
            </Link>
            <a className="btn btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Falar com a Dupply
            </a>
          </div>
        </div>

        <aside className="hero-aside" aria-label="Posicionamento Dupply">
          <figure className="portrait-card">
            <img
              src={ricardoLima}
              alt="Ricardo Lima, CEO da Dupply"
              loading="eager"
              decoding="async"
              width={480}
              height={600}
            />
          </figure>
          <div className="brand-card">
            <span className="brand-card-label">Dupply</span>
            <strong>IA aplicada à realidade da sua empresa</strong>
            <p className="brand-card-tagline">Aprenda construindo no mercado real</p>
          </div>
        </aside>
      </div>

      <div className="wrap">
        <div className="hero-trust">
          <div className="hero-trust-block">
            <p className="hero-trust-label">Como a Dupply trabalha</p>
            <ul className="proof-line">
              {heroProofItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="hero-trust-block">
            <p className="hero-trust-label">O que não prometemos</p>
            <ul className="myth-line" aria-label="Mitos sobre IA que a Dupply não promete">
              {heroPromises.map((myth) => (
                <li key={myth}>{myth}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
