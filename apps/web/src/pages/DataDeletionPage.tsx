import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import {
  ATENDE_URL,
  EXCLUSAO_DADOS_PATH,
  PRIVACIDADE_PATH,
  PRIVACY_EMAIL,
  WHATSAPP_URL,
} from '../constants/links'
import { SITE_NAME } from '../constants/site'
import '../styles/landing.css'

const UPDATED_AT = '27 de agosto de 2026'
const DELETION_DEADLINE_DAYS = 30

export function DataDeletionPage() {
  return (
    <>
      <PageMeta
        title={`Exclusão de dados | ${SITE_NAME}`}
        description="Como solicitar a exclusão dos seus dados na Dupply, incluindo dados obtidos das plataformas Instagram e WhatsApp através do Dupply Atende."
        path={EXCLUSAO_DADOS_PATH}
      />
      <SkipLink />
      <Header />
      <main id="conteudo-principal" className="legal-page">
        <div className="wrap legal-wrap">
          <p className="legal-eyebrow">LGPD · Direito de eliminação</p>
          <h1>Exclusão de dados</h1>
          <p className="legal-lead">
            Esta página explica como pedir a exclusão dos dados que a Dupply trata — inclusive os
            dados recebidos do <strong>Instagram</strong> e do <strong>WhatsApp</strong> através da
            plataforma Dupply Atende.
          </p>
          <p className="legal-updated">Última atualização: {UPDATED_AT}</p>

          <section className="legal-section">
            <h2>1. Antes de começar: qual é o seu caso?</h2>
            <ul>
              <li>
                <strong>Sou cliente da Dupply</strong> e conectei a conta de Instagram ou o número de
                WhatsApp da minha empresa ao Dupply Atende → siga a <a href="#empresa">seção 2</a>.
              </li>
              <li>
                <strong>Enviei uma mensagem para uma empresa</strong> que usa o Dupply Atende e quero
                que meus dados sejam apagados → siga a <a href="#usuario-final">seção 3</a>.
              </li>
              <li>
                <strong>Fiz o diagnóstico gratuito</strong> no site e quero apagar minhas respostas →
                siga a <a href="#diagnostico">seção 4</a>.
              </li>
            </ul>
          </section>

          <section className="legal-section" id="empresa">
            <h2>2. Empresa cliente do Dupply Atende</h2>
            <p>Quando você conecta um canal, a plataforma passa a guardar:</p>
            <ul>
              <li>o identificador e o nome de usuário da conta conectada;</li>
              <li>
                o token de acesso concedido por você, sempre <strong>criptografado</strong>;
              </li>
              <li>
                as conversas trocadas naquele canal — mensagens, identificadores dos contatos e
                arquivos de mídia recebidos.
              </li>
            </ul>
            <p>Para excluir esses dados:</p>
            <ol>
              <li>
                Acesse{' '}
                <a href={ATENDE_URL} target="_blank" rel="noopener noreferrer">
                  {ATENDE_URL}
                </a>{' '}
                e entre na sua conta.
              </li>
              <li>
                Vá em <strong>Canais</strong>, escolha o canal desejado e clique em{' '}
                <strong>Desconectar</strong>. Isso revoga o token e interrompe o recebimento de novas
                mensagens.
              </li>
              <li>
                Para apagar também o histórico já armazenado, envie um pedido para{' '}
                <a href={`mailto:${PRIVACY_EMAIL}?subject=Exclus%C3%A3o%20de%20dados%20-%20Dupply%20Atende`}>
                  {PRIVACY_EMAIL}
                </a>{' '}
                informando a empresa e o canal.
              </li>
            </ol>
            <p>
              Você também pode revogar o acesso diretamente pela Meta, em{' '}
              <strong>Instagram → Configurações → Apps e sites</strong> ou no{' '}
              <strong>Gerenciador de Negócios</strong>. A revogação pela Meta interrompe o acesso,
              mas o histórico já armazenado só é apagado com a solicitação acima.
            </p>
          </section>

          <section className="legal-section" id="usuario-final">
            <h2>3. Usuário final que conversou com uma empresa</h2>
            <p>
              Se você enviou uma mensagem por Instagram ou WhatsApp para uma empresa que usa o Dupply
              Atende, a <strong>empresa</strong> é a controladora desses dados e a Dupply atua como
              operadora, tratando-os apenas sob instrução dela.
            </p>
            <ol>
              <li>
                Peça a exclusão diretamente à empresa com quem você conversou — é o caminho mais
                rápido.
              </li>
              <li>
                Se preferir, escreva para{' '}
                <a href={`mailto:${PRIVACY_EMAIL}?subject=Exclus%C3%A3o%20de%20dados%20-%20usu%C3%A1rio%20final`}>
                  {PRIVACY_EMAIL}
                </a>{' '}
                informando o canal (Instagram ou WhatsApp), o perfil ou número usado e o nome da
                empresa. Encaminhamos o pedido à controladora e apoiamos a execução.
              </li>
            </ol>
            <p>
              Serão eliminadas as mensagens, os identificadores de contato e as mídias associadas ao
              seu perfil naquela conta, ressalvados registros que a lei exija manter.
            </p>
          </section>

          <section className="legal-section" id="diagnostico">
            <h2>4. Diagnóstico gratuito do site</h2>
            <p>
              Envie um e-mail para{' '}
              <a href={`mailto:${PRIVACY_EMAIL}?subject=Exclus%C3%A3o%20de%20dados%20-%20diagn%C3%B3stico`}>
                {PRIVACY_EMAIL}
              </a>{' '}
              com o e-mail usado no questionário. Apagamos as respostas, os dados de contato e o
              relatório gerado.
            </p>
            <p>
              O rascunho em andamento fica apenas no seu navegador: limpar os dados do site remove
              esse conteúdo imediatamente.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Prazo e confirmação</h2>
            <p>
              Confirmamos o recebimento do pedido e concluímos a exclusão em até{' '}
              <strong>{DELETION_DEADLINE_DAYS} dias</strong>, respondendo por e-mail quando estiver
              feito. Podemos pedir informações adicionais para confirmar sua identidade antes de
              executar.
            </p>
            <p>
              Cópias em backups de segurança são sobrescritas dentro do ciclo normal de retenção e
              não são usadas para restaurar dados excluídos.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Outros canais</h2>
            <p>
              Prefere falar por mensagem? Use o{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp da Dupply
              </a>
              . Detalhes sobre quais dados tratamos e por quê estão na{' '}
              <Link to={PRIVACIDADE_PATH}>Política de Privacidade</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
