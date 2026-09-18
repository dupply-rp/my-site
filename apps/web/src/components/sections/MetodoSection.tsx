import monograma from '../../assets/marca/dupply-monograma.svg'
import { metodoCards } from '../../constants/content'

export function MetodoSection() {
  return (
    <section className="dp-sec dp-sec-clara" id="metodo" aria-labelledby="metodo-titulo">
      <img className="dp-marca-dagua" src={monograma} alt="" aria-hidden="true" />
      <div className="dp-wrap">
        <div className="dp-cabecalho">
          <div>
            <p className="dp-eyebrow">O método</p>
            <h2 className="dp-h2" id="metodo-titulo">
              O que empresa grande tem e a sua não tem é método.
            </h2>
          </div>
          <p className="dp-lead">
            Empresa grande tem processo porque tem gente para manter processo. A sua não tem, e não
            precisa ter: eu trago o método pronto, e ele roda na Dupply todo dia.
          </p>
        </div>

        <div className="dp-grid-4">
          {metodoCards.map((card, i) => (
            <article className="dp-card" key={card.titulo}>
              <div className="dp-card-topo">
                <div className="dp-card-fio" aria-hidden="true" />
                <div className="dp-card-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
              <h3>{card.titulo}</h3>
              <p>{card.frase}</p>
            </article>
          ))}
        </div>

        <div className="dp-fecho-metodo">
          <p>Processo de banco, rodando numa empresa pequena.</p>
        </div>
      </div>
    </section>
  )
}
