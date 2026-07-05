import ricardoLima from '../../assets/ricardo-lima.jpg'
import { companies } from '../../constants/content'

export function TrajectorySection() {
  return (
    <section className="section trajectory" id="trajetoria">
      <div className="wrap trajectory-grid">
        <div className="leader-card">
          <img
            src={ricardoLima}
            alt="Ricardo Lima, CEO da Dupply"
            loading="lazy"
            decoding="async"
            width={800}
            height={1024}
          />
          <div className="leader-meta">
            <strong>Ricardo Lima | CEO Dupply</strong>
            <span>Mais de 15 anos transformando tecnologia em soluções que funcionam na prática.</span>
          </div>
        </div>

        <div className="trajectory-copy">
          <span className="eyebrow">Trajetória</span>
          <h2>Experiência de quem já viu tecnologia virar operação.</h2>
          <p>
            Ricardo Lima lidera a Dupply com uma visão objetiva: usar tecnologia para resolver
            problemas reais, reduzir atrito e criar soluções que sobrevivem ao dia a dia das
            empresas.
          </p>
          <div className="company-cloud" aria-label="Empresas da trajetória de Ricardo Lima">
            {companies.map((company) => (
              <span key={company}>{company}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
