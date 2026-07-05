import { heroProofItems, heroPromises } from '../../constants/content'
import ricardoLima from '../../assets/ricardo-lima.jpg'
import { WHATSAPP_URL } from '../../constants/links'

export function ResponsiveHero() {
  return (
    <section className="hero hero-responsive" aria-labelledby="hero-heading">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Inteligência Artificial</span>
          <h1 id="hero-heading">
            Cansado de promessas sobre IA que nunca funcionam na prática?
          </h1>
          <p className="hero-problem">
            Sua empresa não precisa de mais um discurso sobre transformação digital. Precisa de
            automação, integração e processos que funcionem no dia a dia.
          </p>
          <p className="hero-note">
            A Dupply implementa <span>IA para resolver problemas reais</span> — menos promessas,
            mais resultados na operação.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Quero entender como funciona
            </a>
            <a className="btn btn-secondary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Agendar uma conversa
            </a>
          </div>
          <div className="proof-line" role="list" aria-label="Diferenciais da Dupply">
            {heroProofItems.map((item) => (
              <span key={item} role="listitem">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="promise-stack">
            {heroPromises.map((promise) => (
              <span className="promise" key={promise}>
                {promise}
              </span>
            ))}
          </div>

          <figure className="portrait-card">
            <img src={ricardoLima} alt="" loading="lazy" decoding="async" />
          </figure>

          <div className="dupply-card">
            <span>Posicionamento Dupply</span>
            <strong>IA aplicada à realidade da sua empresa</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
