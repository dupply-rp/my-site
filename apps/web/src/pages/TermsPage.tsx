import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import {
  EXCLUSAO_DADOS_PATH,
  PRIVACIDADE_PATH,
  PRIVACY_EMAIL,
  TERMOS_PATH,
  WHATSAPP_URL,
} from '../constants/links'
import { SITE_NAME } from '../constants/site'
import '../styles/landing.css'

const UPDATED_AT = '27 de agosto de 2026'

export function TermsPage() {
  return (
    <>
      <PageMeta
        title={`Termos de Serviço | ${SITE_NAME}`}
        description="Condições de uso do site, do diagnóstico gratuito e da plataforma Dupply Atende — responsabilidades, canais de mensagem, uso de IA e limites do serviço."
        path={TERMOS_PATH}
      />
      <SkipLink />
      <Header />
      <main id="conteudo-principal" className="legal-page">
        <div className="wrap legal-wrap">
          <p className="legal-eyebrow">Condições de uso</p>
          <h1>Termos de Serviço</h1>
          <p className="legal-lead">
            Estes termos regem o uso do site da Dupply, do diagnóstico gratuito e da plataforma de
            atendimento <strong>Dupply Atende</strong>. Ao usar qualquer um deles, você concorda com
            as condições abaixo.
          </p>
          <p className="legal-updated">Última atualização: {UPDATED_AT}</p>

          <section className="legal-section">
            <h2>1. Quem somos e o que oferecemos</h2>
            <p>
              A <strong>Dupply</strong> desenvolve soluções de inteligência artificial aplicada a
              processos de negócio. Estes termos cobrem:
            </p>
            <ul>
              <li>
                <strong>Site institucional</strong> — conteúdo informativo sobre a Dupply.
              </li>
              <li>
                <strong>Diagnóstico gratuito</strong> — questionário que gera um relatório de
                maturidade digital.
              </li>
              <li>
                <strong>Dupply Atende</strong> — plataforma que centraliza o atendimento da sua
                empresa em canais de mensagem (WhatsApp e Instagram), com respostas assistidas por
                IA e atendimento humano.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>2. Quem pode usar</h2>
            <p>
              O Dupply Atende é um serviço <strong>para empresas</strong>. Ao contratá-lo, você
              declara ter capacidade legal e poderes para representar a empresa contratante, e ser
              responsável pelas contas de mensagem que conectar à plataforma.
            </p>
            <p>
              O site e o diagnóstico são de uso livre para maiores de 18 anos, sem necessidade de
              contratação.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Conta e responsabilidades do cliente</h2>
            <ul>
              <li>Manter credenciais de acesso em sigilo e não compartilhá-las.</li>
              <li>
                Garantir que as contas de WhatsApp e Instagram conectadas pertencem à sua empresa e
                que você está autorizado a operá-las.
              </li>
              <li>
                Obter o consentimento necessário dos seus clientes finais para o contato por
                mensagem, quando a legislação exigir.
              </li>
              <li>Responder pelo conteúdo enviado através da plataforma.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Canais de mensagem e políticas das plataformas</h2>
            <p>
              A conexão com WhatsApp e Instagram é feita pelas <strong>APIs oficiais da Meta</strong>
              , mediante autorização explícita da sua empresa. Além destes termos, o uso desses
              canais está sujeito às políticas da Meta — entre elas as Políticas da Plataforma, as
              Políticas de Mensagens do WhatsApp Business e as Diretrizes da Comunidade do Instagram.
            </p>
            <p>É expressamente proibido usar a plataforma para:</p>
            <ul>
              <li>spam, disparo em massa não solicitado ou compra de listas de contatos;</li>
              <li>fraude, phishing, golpes ou falsidade sobre a identidade do remetente;</li>
              <li>conteúdo ilegal, discriminatório, ofensivo ou que viole direitos de terceiros;</li>
              <li>burlar limites técnicos, de taxa ou de política impostos pela Meta.</li>
            </ul>
            <p>
              A Meta pode restringir ou remover o acesso de uma conta às suas APIs de forma
              independente da Dupply. Nesses casos, atuamos para restabelecer o serviço, mas a
              decisão final é da plataforma.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Uso de inteligência artificial</h2>
            <p>
              O Dupply Atende usa modelos de IA de terceiros para sugerir e enviar respostas
              conforme a configuração definida pelo cliente. Respostas de IA{' '}
              <strong>podem conter erros</strong> e não substituem aconselhamento profissional,
              jurídico, médico ou financeiro.
            </p>
            <p>
              O cliente configura o comportamento do agente, pode revisar conversas e assumir o
              atendimento a qualquer momento. A responsabilidade pelo conteúdo publicado em nome da
              empresa permanece do cliente.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Planos, cobrança e cancelamento</h2>
            <p>
              Os planos, preços e ciclos vigentes são os exibidos no momento da contratação. O
              pagamento é processado por instituição de pagamento autorizada pelo Banco Central; os
              dados completos do cartão são digitados no ambiente do processador e não são
              armazenados pela Dupply.
            </p>
            <p>
              O cancelamento pode ser solicitado a qualquer momento e encerra a renovação seguinte,
              sem reembolso proporcional do período já em curso, salvo disposição legal em
              contrário.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Disponibilidade e suporte</h2>
            <p>
              Trabalhamos para manter o serviço disponível de forma contínua, mas ele pode sofrer
              interrupções por manutenção, falhas de terceiros (provedores de infraestrutura, Meta,
              provedores de IA) ou eventos fora do nosso controle. Não garantimos operação
              ininterrupta ou livre de erros.
            </p>
            <p>
              Suporte por{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> ou{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Suspensão e encerramento</h2>
            <p>
              Podemos suspender ou encerrar o acesso em caso de violação destes termos, das
              políticas da Meta, de inadimplência ou de uso que coloque em risco a plataforma ou
              outros clientes. Sempre que possível, avisamos antes.
            </p>
            <p>
              Encerrada a relação, os dados podem ser exportados ou excluídos conforme a{' '}
              <Link to={EXCLUSAO_DADOS_PATH}>página de exclusão de dados</Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Propriedade intelectual</h2>
            <p>
              A plataforma, a marca, o código e os materiais da Dupply são de nossa propriedade. O
              conteúdo que você insere — conversas, contatos, base de conhecimento e configurações —
              continua sendo <strong>seu</strong>. Você nos concede apenas a licença necessária para
              operar o serviço em seu nome.
            </p>
          </section>

          <section className="legal-section">
            <h2>10. Limitação de responsabilidade</h2>
            <p>
              Na máxima extensão permitida pela lei, a responsabilidade da Dupply por perdas
              relacionadas ao serviço fica limitada ao valor pago pelo cliente nos 12 meses
              anteriores ao evento. Não respondemos por lucros cessantes ou danos indiretos.
            </p>
            <p>
              Nada aqui afasta direitos irrenunciáveis do consumidor previstos na legislação
              brasileira.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Privacidade</h2>
            <p>
              O tratamento de dados pessoais é descrito na{' '}
              <Link to={PRIVACIDADE_PATH}>Política de Privacidade</Link>, que integra estes termos.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Alterações</h2>
            <p>
              Podemos atualizar estes termos quando o serviço ou a legislação mudarem. A data no topo
              indica a versão vigente. Mudanças relevantes são comunicadas aos clientes ativos.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Lei aplicável e foro</h2>
            <p>
              Aplica-se a legislação brasileira. Fica eleito o foro da comarca de Vitória da
              Conquista, Bahia, salvo hipótese legal diversa.
            </p>
          </section>

          <p className="legal-cta">
            Dúvidas sobre estes termos?{' '}
            <a href={`mailto:${PRIVACY_EMAIL}`}>Fale com a gente</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
