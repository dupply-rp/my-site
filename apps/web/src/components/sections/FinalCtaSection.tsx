import { Link } from 'react-router-dom'
import monograma from '../../assets/marca/dupply-monograma.svg'
import { DIAGNOSTICO_PATH, whatsappUrl } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'
import { IconeWhatsApp } from '../Icones'

export function FinalCtaSection() {
  return (
    <section className="dp-fecho" id="contato" aria-labelledby="fecho-titulo">
      <img className="dp-marca-dagua" src={monograma} alt="" aria-hidden="true" />
      <div className="dp-wrap">
        <div className="dp-fecho-inner">
          <h2 id="fecho-titulo">Descubra em cinco minutos onde a IA gera valor na sua empresa.</h2>
          <p className="dp-fecho-sub">
            Um questionário curto, um relatório com score de maturidade e as oportunidades da sua
            operação. Sem cartão, sem compromisso.
          </p>

          <div className="dp-fecho-acoes">
            <Link
              className="dp-btn dp-btn-branco"
              to={DIAGNOSTICO_PATH}
              onClick={() =>
                trackCtaClick('diagnostico_gratuito', {
                  location: 'fecho',
                  destination: DIAGNOSTICO_PATH,
                })
              }
            >
              Fazer o diagnóstico gratuito
            </Link>

            <a
              className="dp-btn dp-btn-fantasma-claro"
              href={whatsappUrl('fecho')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackCtaClick('whatsapp', { location: 'fecho', destination: 'whatsapp' })
              }
            >
              <IconeWhatsApp />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
