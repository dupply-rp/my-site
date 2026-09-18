import { processSteps } from '../../constants/content'

export function ProcessSection() {
  return (
    <section className="dp-sec dp-sec-clara" id="atuacao" aria-labelledby="atuacao-titulo">
      <div className="dp-wrap">
        <div className="dp-cabecalho">
          <div>
            <p className="dp-eyebrow">Como funciona</p>
            <h2 className="dp-h2" id="atuacao-titulo">
              Da conversa inicial à solução funcionando.
            </h2>
          </div>
        </div>

        <div className="dp-etapas">
          {processSteps.map((step, i) => (
            <article className="dp-etapa" key={step.title}>
              <div className="dp-etapa-num">ETAPA {String(i + 1).padStart(2, '0')}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
