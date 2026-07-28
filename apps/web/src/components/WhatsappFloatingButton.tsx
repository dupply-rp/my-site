import { WHATSAPP_URL } from '../constants/links'
import { trackCtaClick } from '../lib/analytics'

function WhatsAppIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="16" fill="#25D366" />
      <path
        fill="#fff"
        d="M23.47 8.52A10.6 10.6 0 0 0 16 5.4c-5.85 0-10.6 4.75-10.6 10.6 0 1.87.49 3.7 1.42 5.31L5.33 26.6l5.44-1.43a10.58 10.58 0 0 0 5.22 1.4h.01c5.85 0 10.6-4.75 10.6-10.6a10.53 10.53 0 0 0-3.13-7.45Zm-7.47 16.3h-.01a8.8 8.8 0 0 1-4.48-1.23l-.32-.19-3.23.85.86-3.15-.21-.32a8.79 8.79 0 0 1-1.35-4.68c0-4.86 3.95-8.81 8.81-8.81a8.75 8.75 0 0 1 6.23 2.58 8.75 8.75 0 0 1 2.58 6.23c0 4.86-3.95 8.81-8.81 8.81Zm4.83-6.6c-.26-.13-1.57-.78-1.82-.86-.24-.09-.42-.13-.6.13-.18.26-.69.86-.85 1.04-.16.18-.31.2-.58.07-.26-.13-1.11-.41-2.11-1.31-.78-.7-1.31-1.55-1.46-1.82-.16-.26-.02-.4.11-.53.12-.12.26-.31.39-.47.13-.16.17-.26.26-.44.09-.18.04-.33-.02-.47-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.51c-.18 0-.47.07-.71.33-.24.26-.94.92-.94 2.24s.96 2.6 1.1 2.78c.13.18 1.89 2.88 4.58 4.04.64.28 1.14.44 1.53.56.64.2 1.23.18 1.69.11.52-.08 1.57-.64 1.79-1.26.22-.62.22-1.15.16-1.26-.07-.11-.24-.18-.5-.31Z"
      />
    </svg>
  )
}

export function WhatsappFloatingButton() {
  return (
    <a
      className="whatsapp-fab"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Dupply pelo WhatsApp"
      title="Falar com a Dupply pelo WhatsApp"
      onClick={() =>
        trackCtaClick('whatsapp', { location: 'floating_button', destination: 'whatsapp' })
      }
    >
      <WhatsAppIcon />
    </a>
  )
}
