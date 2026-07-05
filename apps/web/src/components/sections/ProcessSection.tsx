import { processSteps } from '../../constants/content'

export function ProcessSection() {
  return (
    <section className="section" id="atuacao">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Como a Dupply atua</span>
            <h2>Da conversa inicial à solução funcionando.</h2>
          </div>
          <p>
            A Dupply não começa por ferramenta. Começa por entender onde existe perda de tempo,
            risco, repetição e oportunidade de ganho real.
          </p>
        </div>

        <div className="steps">
          {processSteps.map((step, index) => (
            <article className="step-card" key={step.title}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
