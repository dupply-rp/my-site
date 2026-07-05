import { benefits } from '../../constants/content'

export function BenefitsSection() {
  return (
    <section className="section benefits" id="beneficios">
      <div className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Benefícios</span>
            <h2>O resultado aparece quando a operação fica mais simples.</h2>
          </div>
          <p>
            IA, para a Dupply, não é espetáculo. É estrutura para fazer melhor, decidir com mais
            clareza e recuperar tempo.
          </p>
        </div>

        <div className="card-grid">
          {benefits.map((benefit) => (
            <article className="benefit-card" key={benefit}>
              <h3>{benefit}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
