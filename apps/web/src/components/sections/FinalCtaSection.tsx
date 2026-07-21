import { WHATSAPP_URL } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'

export function FinalCtaSection() {
  return (
    <section className="final-cta">
      <div className="wrap final-box">
        <div>
          <h2>Chega de promessas. Vamos construir algo que funcione na prática.</h2>
          <p>Uma conversa direta para entender onde a IA pode gerar valor real na sua empresa.</p>
        </div>
        <a
          className="btn"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackCtaClick('whatsapp', { location: 'final_cta', destination: 'whatsapp' })
          }
        >
          Falar com a Dupply
        </a>
      </div>
    </section>
  )
}
