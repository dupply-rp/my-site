import { Link } from 'react-router-dom'
import ricardo from '../../assets/marca/ricardo-estudio.jpg'
import { DIAGNOSTICO_PATH, whatsappUrl } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'
import { IconeWhatsApp } from '../Icones'

export function Hero() {
  return (
    <section className="dp-hero" aria-labelledby="hero-heading">
      <img
        className="dp-hero-foto"
        src={ricardo}
        alt="Ricardo Lima, fundador da Dupply"
        width={769}
        height={1134}
        loading="eager"
        decoding="async"
      />
      <div className="dp-hero-veu" aria-hidden="true" />

      <div className="dp-wrap">
        <div className="dp-hero-inner dp-anima">
          <div className="dp-hero-fio" aria-hidden="true" />
          <p className="dp-eyebrow">Ricardo Lima · fundador da Dupply</p>
          <h1 id="hero-heading">
            O que falta na sua operação não é mais uma ferramenta de IA. É método por trás dela.
          </h1>
          <p className="dp-hero-sub">
            21 anos fazendo tecnologia funcionar em operação que não pode parar. Agora esse método
            entra na sua operação, e a IA vem junto com ele.
          </p>

          <div className="dp-hero-acoes dp-acoes-lado">
            <Link
              className="dp-btn dp-btn-primary"
              to={DIAGNOSTICO_PATH}
              onClick={() =>
                trackCtaClick('diagnostico_gratuito', {
                  location: 'heroi',
                  destination: DIAGNOSTICO_PATH,
                })
              }
            >
              Fazer o diagnóstico gratuito
            </Link>
            <a
              className="dp-btn dp-btn-fantasma"
              href={whatsappUrl('heroi')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCtaClick('whatsapp', { location: 'heroi', destination: 'whatsapp' })
              }
            >
              <IconeWhatsApp />
              Falar no WhatsApp
            </a>
          </div>

          <p className="dp-micro">5 minutos, sem cartão. O relatório chega no seu e-mail.</p>
        </div>
      </div>
    </section>
  )
}
