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
            precisa ter: eu trago o método pronto, e ele roda no seu negócio todo dia.
          </p>
        </div>

        <ol className="dp-metodo-lista">
          {metodoCards.map((card, i) => (
            <li key={card.titulo}>
              <span className="dp-metodo-num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{card.titulo}</h3>
              <p>{card.frase}</p>
            </li>
          ))}
        </ol>

        <p className="dp-metodo-fecho">
          Método de operação grande, na velocidade de empresa pequena.
        </p>
      </div>
    </section>
  )
}
