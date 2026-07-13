import type { CompanyId } from '../constants/content'

interface CompanyIconProps {
  id: CompanyId
}

export function CompanyIcon({ id }: CompanyIconProps) {
  switch (id) {
    case 'itau':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#003B71" />
          <rect x="5" y="5" width="8" height="8" rx="1.5" fill="#EC7000" />
          <rect x="15" y="5" width="4" height="14" rx="1" fill="#fff" opacity="0.9" />
        </svg>
      )
    case 'santander':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#EC0000" />
          <path
            d="M12 5c-2.8 3.2-4.5 5.8-4.5 8.2 0 2.2 1.8 4 4 4s4-1.8 4-4c0-2.4-1.7-5-3.5-8.2Z"
            fill="#fff"
          />
        </svg>
      )
    case 'neon':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#00D4FF" />
          <circle cx="12" cy="12" r="5" fill="#00FF8A" />
          <circle cx="12" cy="12" r="2.2" fill="#003B71" />
        </svg>
      )
    case 'toro':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#111827" />
          <path d="M7 16V8h3.2c2.2 0 3.8 1.2 3.8 3.2S12.4 14.5 10.2 14.5H9.4V16H7Zm2.4-2.2h.8c1 0 1.6-.5 1.6-1.3s-.6-1.3-1.6-1.3H9.4v2.6Z" fill="#F5B335" />
          <path d="M14.8 8H17l2.2 8H19l-.5-2h-2.4l-.5 2h-1.8l2.2-8Zm1.4 4.2.8-3 .8 3h-1.6Z" fill="#fff" />
        </svg>
      )
    case 'pravaler':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#0057A8" />
          <path d="M7 16V8h4.8c2.1 0 3.5 1.1 3.5 2.8 0 1.2-.7 2.1-1.8 2.5L16 16h-2.3l-2-3.2H9.4V16H7Zm2.4-4.8h2.1c.8 0 1.2-.4 1.2-.9s-.4-.9-1.2-.9H9.4v1.8Z" fill="#fff" />
        </svg>
      )
    case 'claro':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#DA291C" />
          <circle cx="12" cy="12" r="6" fill="none" stroke="#fff" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.2" fill="#fff" />
        </svg>
      )
    case 'boticario':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#008B4A" />
          <path
            d="M12 6c-2.8 2.4-4.5 4.8-4.5 7.2 0 2 1.6 3.6 4.5 3.6s4.5-1.6 4.5-3.6C16.5 10.8 14.8 8.4 12 6Z"
            fill="#B8E986"
          />
          <path d="M12 9.2v7.2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'rdstation':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#19C1CE" />
          <path d="M9 7h6.8c2.4 0 4 1.4 4 3.5S18.2 14 15.8 14H12v3H9V7Zm3 4.2h2.5c1 0 1.6-.5 1.6-1.3s-.6-1.3-1.6-1.3H12v2.6Z" fill="#fff" />
        </svg>
      )
    case 'totvs':
      return (
        <svg className="company-icon" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="5" fill="#004696" />
          <path d="M6 8h12v2.2H11.8V16H9.4v-5.8H6V8Zm8.2 0H18v8h-2.4V8Z" fill="#fff" />
          <path d="M6 18.2h12v1.4H6v-1.4Z" fill="#00AEEF" />
        </svg>
      )
    default:
      return null
  }
}
