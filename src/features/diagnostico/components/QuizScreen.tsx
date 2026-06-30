import type { FlatQuestion, Answers } from '../types'
import { formatPhoneBr, stripPhoneDigits } from '../formatPhone'
import { OptionCard } from './OptionCard'

interface QuizScreenProps {
  question: FlatQuestion
  currentIndex: number
  totalQuestions: number
  progressPct: number
  answers: Answers
  fieldErrors: Record<string, string>
  onAnswer: (questionId: string, value: string | string[]) => void
  onToggleMulti: (questionId: string, value: string) => void
  onNext: () => void
  onPrev: () => void
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export function QuizScreen({
  question,
  currentIndex,
  totalQuestions,
  progressPct,
  answers,
  fieldErrors,
  onAnswer,
  onToggleMulti,
  onNext,
  onPrev,
}: QuizScreenProps) {
  const textValue = String(answers[question.id] ?? '')
  const isFirst = currentIndex === 0
  const isLast = currentIndex === totalQuestions - 1
  const isMulti = question.type === 'multi'

  const renderOptions = () => {
    if (question.type === 'contact') {
      return (
        <div className="diag-contact-fields">
          {question.fields.map((field) => {
            const error = fieldErrors[field.id]
            return (
              <div className="diag-field-group" key={field.id}>
                <label className="diag-field-label" htmlFor={`field-${field.id}`}>
                  {field.label}
                  {field.required ? <span className="diag-required">*</span> : null}
                </label>
                <input
                  id={`field-${field.id}`}
                  type={field.inputType}
                  className={`diag-input-field${error ? ' diag-input-error' : ''}`}
                  placeholder={field.placeholder ?? ''}
                  value={
                    field.inputType === 'tel'
                      ? formatPhoneBr(String(answers[field.id] ?? ''))
                      : String(answers[field.id] ?? '')
                  }
                  onChange={(event) => {
                    const raw = event.target.value
                    onAnswer(
                      field.id,
                      field.inputType === 'tel' ? stripPhoneDigits(raw) : raw,
                    )
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') onNext()
                  }}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `error-${field.id}` : undefined}
                  autoComplete={field.inputType === 'email' ? 'email' : field.inputType === 'tel' ? 'tel' : 'organization'}
                />
                {error && (
                  <p id={`error-${field.id}`} className="diag-field-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )
    }

    if (question.type === 'text') {
      const error = fieldErrors[question.id]
      return (
        <>
          <input
            type="text"
            className={`diag-input-field${error ? ' diag-input-error' : ''}`}
            placeholder={question.placeholder ?? ''}
            value={textValue}
            onChange={(event) => onAnswer(question.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onNext()
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `error-${question.id}` : undefined}
          />
          {error && (
            <p id={`error-${question.id}`} className="diag-field-error" role="alert">
              {error}
            </p>
          )}
        </>
      )
    }

    if (question.type === 'select') {
      return (
        <select
          className="diag-input-field"
          value={textValue}
          onChange={(event) => onAnswer(question.id, event.target.value)}
        >
          <option value="">Selecione…</option>
          {question.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    if (question.type === 'single') {
      const cols = question.options.length >= 4 ? ' cols-2' : ''
      return (
        <div className={`diag-options-grid${cols}`}>
          {question.options.map((option) => (
            <OptionCard
              key={option.l}
              emoji={option.e}
              label={option.l}
              description={option.d}
              selected={answers[question.id] === option.l}
              onSelect={() => onAnswer(question.id, option.l)}
            />
          ))}
        </div>
      )
    }

    const selected = Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : []
    return (
      <div className="diag-options-grid">
        {question.options.map((option) => (
          <OptionCard
            key={option.l}
            emoji={option.e}
            label={option.l}
            description={option.d}
            selected={selected.includes(option.l)}
            onSelect={() => onToggleMulti(question.id, option.l)}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <header className="diag-quiz-header">
        <div className="diag-quiz-header-inner">
          <div className="diag-quiz-logo">
            <span className="diag-logo-dot" aria-hidden />
            Dupply
          </div>
          <div className="diag-progress-wrap">
            <div className="diag-progress-label">
              <span>
                Pergunta {currentIndex + 1} de {totalQuestions}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="diag-progress-bar-bg">
              <div className="diag-progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>
      </header>

      <div className="diag-quiz-body">
        <div className="diag-question-container" key={question.id}>
          <span className="diag-section-badge">{question.sectionLabel}</span>
          <p className="diag-question-number">
            Pergunta {currentIndex + 1} de {totalQuestions}
          </p>
          <h2 className="diag-question-text">{question.text}</h2>
          {question.hint && (
            <p className="diag-question-hint">
              {question.hint}
              {isMulti ? ' · Pode marcar mais de uma' : ''}
            </p>
          )}

          {renderOptions()}

          <div className="diag-quiz-nav">
            {!isFirst ? (
              <button type="button" className="btn btn-secondary" onClick={onPrev}>
                ← Voltar
              </button>
            ) : (
              <div />
            )}
            <button type="button" className="btn btn-primary" onClick={onNext}>
              {isLast ? 'Gerar Relatório' : 'Próxima'}
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
