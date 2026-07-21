import { Link } from 'react-router-dom'
import { DIAGNOSTICO_PATH, PRIVACIDADE_PATH, WHATSAPP_URL } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'

const SOCIAL_ICON_SIZE = 20

function InstagramIcon() {
  return (
    <svg
      className="social-icon"
      width={SOCIAL_ICON_SIZE}
      height={SOCIAL_ICON_SIZE}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003ZM12 6.1a5.9 5.9 0 1 0 0 11.8 5.9 5.9 0 0 0 0-11.8Zm0 2.4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM17.55 5.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      className="social-icon"
      width={SOCIAL_ICON_SIZE}
      height={SOCIAL_ICON_SIZE}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <nav className="footer-links" aria-label="Links do rodapé">
          <Link
            to={DIAGNOSTICO_PATH}
            onClick={() =>
              trackCtaClick('diagnostico_gratuito', {
                location: 'footer',
                destination: DIAGNOSTICO_PATH,
              })
            }
          >
            Diagnóstico gratuito
          </Link>
          <a href="/#faq">FAQ</a>
          <Link to={PRIVACIDADE_PATH}>Privacidade</Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackCtaClick('whatsapp', { location: 'footer', destination: 'whatsapp' })
            }
          >
            WhatsApp
          </a>
        </nav>
        <div className="socials">
          <a
            href="https://www.instagram.com/dupplybr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
            @dupplybr
          </a>
          <a
            href="https://linkedin.com/company/dupplybr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedInIcon />
            dupply
          </a>
        </div>
      </div>
    </footer>
  )
}
