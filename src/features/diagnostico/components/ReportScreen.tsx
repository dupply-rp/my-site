import { useEffect, useState } from 'react'
import { WHATSAPP_URL } from '../../../constants/links'
import type { Answers, DiagnosticoReport } from '../types'

interface ReportScreenProps {
  answers: Answers
  report: DiagnosticoReport
  onRestart: () => void
}

export function ReportScreen({ answers, report, onRestart }: ReportScreenProps) {
  const { score, scoreInfo, pillars, reportHtml, aiGenerated = true } = report
  const company = String(answers.nome || 'Sua Empresa')
  const [displayScore, setDisplayScore] = useState(0)
  const [ringOffset, setRingOffset] = useState(408)
  const [pillarWidths, setPillarWidths] = useState<number[]>(pillars.map(() => 0))

  const circumference = 2 * Math.PI * 65

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setRingOffset(circumference - (score / 100) * circumference)

      const start = performance.now()
      const duration = 1400

      const animate = (timestamp: number) => {
        const progress = Math.min((timestamp - start) / duration, 1)
        const eased = 1 - (1 - progress) ** 3
        setDisplayScore(Math.round(eased * score))
        if (progress < 1) requestAnimationFrame(animate)
      }

      requestAnimationFrame(animate)
      setPillarWidths(pillars.map((pillar) => pillar.score))
    }, 150)

    return () => window.clearTimeout(timeout)
  }, [circumference, pillars, score])

  const subtitle = [answers.setor, answers.porte, company].filter(Boolean).join(' · ')

  return (
    <div className="diag-report">
      <header className="diag-report-header">
        <span className="diag-report-badge">✓ Diagnóstico concluído</span>
        <h1 className="diag-report-title">Relatório de IA — {company}</h1>
        <p className="diag-report-company">{subtitle}</p>
      </header>

      <div className="diag-report-body">
        <section className="diag-score-section">
          <div className="diag-score-ring-wrap">
            <div className="diag-score-ring">
              <svg viewBox="0 0 140 140" aria-hidden>
                <defs>
                  <linearGradient id="diag-score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0718ff" />
                    <stop offset="100%" stopColor="#2d73ff" />
                  </linearGradient>
                </defs>
                <circle className="diag-score-ring-bg" cx="70" cy="70" r="65" />
                <circle
                  className="diag-score-ring-fill"
                  cx="70"
                  cy="70"
                  r="65"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: ringOffset,
                  }}
                />
              </svg>
              <div className="diag-score-ring-text">
                <span className="diag-score-number">{displayScore}</span>
                <span className="diag-score-label-sm">/ 100</span>
              </div>
            </div>
            <span className="diag-score-ring-label" style={{ color: scoreInfo.color }}>
              {scoreInfo.label}
            </span>
          </div>
          <div className="diag-score-info">
            <h3>{scoreInfo.label}</h3>
            <p>{scoreInfo.desc}</p>
          </div>
        </section>

        <div className="diag-pillars-grid">
          {pillars.map((pillar, index) => (
            <article className="diag-pillar-card" key={pillar.name}>
              <span className="diag-pillar-icon" aria-hidden>
                {pillar.icon}
              </span>
              <p className="diag-pillar-name">{pillar.name}</p>
              <div className="diag-pillar-bar-bg">
                <div
                  className="diag-pillar-bar-fill"
                  style={{ width: `${pillarWidths[index]}%` }}
                />
              </div>
              <p className="diag-pillar-score">
                {pillar.score}
                <span>/100</span>
              </p>
            </article>
          ))}
        </div>

        <div className="diag-divider" />

        <section className="diag-report-section">
          <div className="diag-section-header">
            <span className="diag-section-icon" aria-hidden>
              🤖
            </span>
            <h2 className="diag-section-title">Análise Completa com IA</h2>
          </div>
          {!aiGenerated && (
            <p className="diag-api-notice" role="status">
              Não foi possível gerar o relatório completo com IA agora. Exibimos um resumo com base nas suas respostas.
            </p>
          )}
          <div
            className="diag-report-formatted"
            dangerouslySetInnerHTML={{ __html: reportHtml }}
          />
        </section>

        <aside className="diag-report-cta">
          <h3 className="diag-cta-title">Pronto para dar o próximo passo?</h3>
          <p className="diag-cta-sub">
            A Dupply ajuda empresas como a sua a implementar IA de forma prática, com resultados mensuráveis desde a
            primeira semana.
          </p>
          <div className="diag-cta-buttons">
            <a className="btn btn-primary" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Falar com a Dupply
            </a>
            <button type="button" className="btn btn-secondary" onClick={() => window.print()}>
              Imprimir relatório
            </button>
            <button type="button" className="btn btn-secondary" onClick={onRestart}>
              Refazer diagnóstico
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
