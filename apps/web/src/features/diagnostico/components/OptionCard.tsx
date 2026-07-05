interface OptionCardProps {
  emoji: string
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

export function OptionCard({ emoji, label, description, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      className={`diag-option-card${selected ? ' selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="diag-option-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="diag-option-content">
        <span className="diag-option-label">{label}</span>
        <span className="diag-option-desc">{description}</span>
      </span>
      <span className="diag-option-check" aria-hidden>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    </button>
  )
}
