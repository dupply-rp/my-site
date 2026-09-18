import { Link } from 'react-router-dom'
import { produtos } from '../../constants/content'
import { DIAGNOSTICO_PATH, whatsappProduto } from '../../constants/links'
import { trackCtaClick } from '../../lib/analytics'
import { IconeSeta } from '../Icones'

export function SolucoesSection() {
  return (
    <section className="dp-sec dp-sec-branca" id="solucoes" aria-labelledby="solucoes-titulo">
      <div className="dp-wrap">
        <div className="dp-cabecalho">
          <div>
            <p className="dp-eyebrow">O que a Dupply faz</p>
            <h2 className="dp-h2" id="solucoes-titulo">
              IA e sistema para qualquer área da sua operação.
            </h2>
          </div>
          <p className="dp-lead">
            Vendas, atendimento, financeiro, gestão, operação. Quando já existe sistema pronto que
            resolve, a gente usa. Quando não existe, a gente constrói para o seu caso.
          </p>
        </div>

        <p className="dp-solucoes-sub">Quatro que já rodam com cliente hoje</p>

        <div className="dp-grid-2">
          {produtos.map((produto) => (
            <article className="dp-produto" key={produto.nome}>
              <div className="dp-produto-topo">
                <h3>{produto.nome}</h3>
                {produto.piloto ? <span className="dp-pill">EM PILOTO</span> : null}
              </div>
              <p>{produto.descricao}</p>
              {produto.nota ? <p className="dp-nota">{produto.nota}</p> : null}
              <a
                className="dp-produto-link"
                href={whatsappProduto(produto.nome)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackCtaClick('whatsapp', {
                    location: 'produto_' + produto.nome.toLowerCase(),
                    destination: 'whatsapp',
                  })
                }
              >
                Falar sobre o {produto.nome}
                <IconeSeta />
              </a>
            </article>
          ))}
        </div>

        <div className="dp-solucoes-fecho">
          <p>
            <strong>A sua área não está aqui?</strong> É o caso mais comum, e é para ele que existe
            a consultoria: o diagnóstico mostra onde a IA entra na sua operação, e a solução nasce
            dele, pronta ou sob medida.
          </p>
          <Link
            className="dp-produto-link"
            to={DIAGNOSTICO_PATH}
            onClick={() =>
              trackCtaClick('diagnostico_gratuito', {
                location: 'solucoes',
                destination: DIAGNOSTICO_PATH,
              })
            }
          >
            Começar pelo diagnóstico
            <IconeSeta />
          </Link>
        </div>
      </div>
    </section>
  )
}
