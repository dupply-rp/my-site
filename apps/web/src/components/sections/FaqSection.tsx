import { faqItems } from '../../constants/faq'

export function FaqSection() {
  return (
    <section className="dp-sec dp-sec-clara" id="faq" aria-labelledby="faq-heading">
      <div className="dp-wrap">
        <div className="dp-faq">
          <div className="dp-faq-titulo">
            <p className="dp-eyebrow">Dúvidas</p>
            <h2 className="dp-h2" id="faq-heading">
              Antes de começar o diagnóstico.
            </h2>
          </div>

          <div className="dp-faq-lista">
            {faqItems.map((item, i) => (
              <details className="dp-faq-item" key={item.question} open={i === 0}>
                <summary>
                  <span>{item.question}</span>
                  <span className="dp-faq-sinal" aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
