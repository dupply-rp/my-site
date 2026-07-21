import { faqItems } from '../../constants/faq'

export function FaqSection() {
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="wrap">
        <span className="eyebrow">Perguntas frequentes</span>
        <h2 id="faq-heading">Antes de começar o diagnóstico</h2>
        <p className="faq-lead">
          Respostas diretas sobre o que você recebe, quanto tempo leva e o que acontece depois.
        </p>

        <div className="faq-list">
          {faqItems.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
