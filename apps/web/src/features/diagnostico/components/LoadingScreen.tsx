import { useEffect, useState } from 'react'

const STEPS = [
  'Mapeando processos críticos',
  'Identificando oportunidades de automação',
  'Calculando potencial de impacto',
  'Gerando recomendações com IA',
  'Montando seu roadmap',
]

export function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStep((step) => (step < STEPS.length - 1 ? step + 1 : step))
    }, 900)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="diag-loading">
      <div className="diag-loading-orb" aria-hidden />
      <h2 className="diag-loading-title">Analisando sua empresa…</h2>
      <p className="diag-loading-sub">
        Nossa IA está processando suas respostas e construindo um relatório personalizado para você.
      </p>
      <ol className="diag-loading-steps">
        {STEPS.map((label, index) => {
          let state = ''
          if (index < activeStep) state = ' done'
          else if (index === activeStep) state = ' active'
          return (
            <li key={label} className={`diag-loading-step${state}`}>
              <span className="diag-step-dot" aria-hidden />
              {label}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
