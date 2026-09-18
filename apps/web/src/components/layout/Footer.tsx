import { Link } from 'react-router-dom'
import {
  DIAGNOSTICO_PATH,
  EXCLUSAO_DADOS_PATH,
  PRIVACIDADE_PATH,
  TERMOS_PATH,
  WHATSAPP_PHONE,
  whatsappUrl,
} from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'
import assinatura from '../../assets/marca/dupply-assinatura-escura.png'
import {
  IconeDocumento,
  IconeDuvida,
  IconeEscudo,
  IconeInstagram,
  IconeLinkedIn,
  IconeLixeira,
  IconeSeta,
  IconeTelefone,
} from '../Icones'

const legais = [
  { to: PRIVACIDADE_PATH, label: 'Privacidade', icone: <IconeEscudo /> },
  { to: TERMOS_PATH, label: 'Termos', icone: <IconeDocumento /> },
  { to: EXCLUSAO_DADOS_PATH, label: 'Exclusão de dados', icone: <IconeLixeira /> },
]

const redes = [
  {
    href: 'https://www.instagram.com/ricardo.lima.ia',
    label: '@ricardo.lima.ia',
    icone: <IconeInstagram />,
  },
  {
    href: 'https://www.instagram.com/dupplybr',
    label: '@dupplybr',
    icone: <IconeInstagram />,
  },
  {
    href: 'https://linkedin.com/company/dupplybr',
    label: 'dupply',
    icone: <IconeLinkedIn />,
  },
]

export function Footer() {
  return (
    <footer className="dp-rodape">
      <div className="dp-wrap dp-rodape-grade">
        <div className="dp-rodape-marca">
          <img src={assinatura} alt="Dupply" height={48} />
          <a
            className="dp-rodape-fone"
            href={whatsappUrl('heroi')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCtaClick('whatsapp', { location: 'rodape', destination: 'whatsapp' })
            }
          >
            <IconeTelefone />
            {WHATSAPP_PHONE}
          </a>
        </div>

        <nav className="dp-rodape-links" aria-label="Links do rodapé">
          <Link
            className="dp-rodape-destaque"
            to={DIAGNOSTICO_PATH}
            onClick={() =>
              trackCtaClick('diagnostico_gratuito', {
                location: 'rodape',
                destination: DIAGNOSTICO_PATH,
              })
            }
          >
            <IconeSeta />
            Diagnóstico gratuito
          </Link>
          <a href="/#faq">
            <IconeDuvida />
            Dúvidas
          </a>
          {legais.map((item) => (
            <Link key={item.label} to={item.to}>
              {item.icone}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="dp-rodape-redes">
          {redes.map((rede) => (
            <a
              key={rede.href}
              href={rede.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={rede.label}
            >
              {rede.icone}
              <span>{rede.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
