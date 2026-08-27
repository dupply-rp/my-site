import { Link } from 'react-router-dom'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'
import { PageMeta } from '../components/seo/PageMeta'
import { SkipLink } from '../components/seo/SkipLink'
import {
  ATENDE_URL,
  DIAGNOSTICO_PATH,
  EXCLUSAO_DADOS_PATH,
  PRIVACIDADE_PATH,
  PRIVACY_EMAIL,
  WHATSAPP_URL,
} from '../constants/links'
import { SITE_NAME } from '../constants/site'
import { openCookieConsentPreferences } from '../lib/cookieConsent'
import '../styles/landing.css'

const UPDATED_AT = '27 de agosto de 2026'

export function PrivacyPage() {
  return (
    <>
      <PageMeta
        title={`Privacidade | ${SITE_NAME}`}
        description="Como a Dupply coleta, usa e protege dados no site, no diagnóstico gratuito e na plataforma Dupply Atende (WhatsApp e Instagram). Em linguagem clara, alinhada à LGPD."
        path={PRIVACIDADE_PATH}
      />
      <SkipLink />
      <Header />
      <main id="conteudo-principal" className="legal-page">
        <div className="wrap legal-wrap">
          <p className="legal-eyebrow">Confiança · LGPD</p>
          <h1>Política de Privacidade</h1>
          <p className="legal-lead">
            Esta página explica, em linguagem direta, quais dados a Dupply trata quando você usa o site,
            o diagnóstico gratuito ou a plataforma de atendimento Dupply Atende — e para quê.
          </p>
          <p className="legal-updated">Última atualização: {UPDATED_AT}</p>

          <section className="legal-section">
            <h2>1. Quem é o responsável</h2>
            <p>
              O controlador dos dados pessoais tratados neste site é a <strong>Dupply</strong>. Para
              dúvidas ou solicitações sobre privacidade, use{' '}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a> ou o{' '}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
              .
            </p>
            <p>
              No <strong>Dupply Atende</strong> o papel é outro: a empresa cliente que conecta seus
              canais é a <strong>controladora</strong> das conversas com o público dela, e a Dupply
              atua como <strong>operadora</strong>, tratando esses dados apenas sob instrução da
              empresa. Veja a seção 4.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Quais dados coletamos</h2>
            <ul>
              <li>
                <strong>Diagnóstico gratuito</strong> — respostas do questionário (perfil da empresa,
                operações, sistemas, dores e prioridades), além de nome/empresa, e-mail e telefone
                para enviar o relatório e, se você pedir, entrar em contato.
              </li>
              <li>
                <strong>Rascunho no navegador</strong> — progresso e respostas em andamento ficam no{' '}
                <code>localStorage</code> do seu dispositivo (até ~7 dias), para você poder continuar
                depois. Esse rascunho não é enviado ao servidor até você concluir o diagnóstico.
              </li>
              <li>
                <strong>Proteção contra bots</strong> — verificação Cloudflare Turnstile (token de
                segurança; não usamos captcha visual invasivo).
              </li>
              <li>
                <strong>Métricas de uso</strong> — Google Analytics 4 com IP anonimizado,{' '}
                <em>somente se você aceitar</em> cookies de analytics no aviso do site.
              </li>
              <li>
                <strong>Dados técnicos de segurança</strong> — IP e metadados mínimos para rate limit
                e prevenção de abuso nas APIs.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Para que usamos</h2>
            <ul>
              <li>Gerar e enviar o relatório personalizado do diagnóstico.</li>
              <li>Atender pedidos de contato e conversas comerciais que você iniciar.</li>
              <li>Melhorar o produto (ex.: onde as pessoas abandonam o quiz) e o site.</li>
              <li>Proteger o serviço contra spam, fraude e uso abusivo.</li>
            </ul>
            <p>
              Não vendemos seus dados. Não usamos o conteúdo do diagnóstico para publicidade de
              terceiros.
            </p>
          </section>

          <section className="legal-section" id="atende-plataformas-meta">
            <h2>4. Dupply Atende — WhatsApp e Instagram</h2>
            <p>
              O{' '}
              <a href={ATENDE_URL} target="_blank" rel="noopener noreferrer">
                Dupply Atende
              </a>{' '}
              centraliza o atendimento da empresa cliente em canais de mensagem. A conexão é feita
              pelas <strong>APIs oficiais da Meta</strong>, mediante autorização explícita da empresa
              titular da conta.
            </p>
            <p>Ao conectar um canal, tratamos:</p>
            <ul>
              <li>
                <strong>Dados da conta conectada</strong> — identificador e nome de usuário da conta
                de Instagram ou do número de WhatsApp, e o token de acesso concedido, guardado{' '}
                <strong>criptografado</strong> e usado apenas para operar aquele canal.
              </li>
              <li>
                <strong>Conversas</strong> — mensagens recebidas e enviadas, com data/hora e o
                identificador do contato fornecido pela plataforma (no Instagram, um identificador
                válido só no escopo daquela conta).
              </li>
              <li>
                <strong>Mídias</strong> — áudios, imagens e arquivos enviados na conversa, guardados
                em storage privado para exibição no histórico.
              </li>
            </ul>
            <p>
              <strong>Para quê:</strong> exibir a conversa no inbox da empresa, gerar respostas
              assistidas por IA conforme a configuração dela, manter o histórico do atendimento e
              proteger o serviço contra abuso.
            </p>
            <p>
              <strong>O que não fazemos:</strong> não vendemos esses dados, não os usamos para
              publicidade, não os compartilhamos com outras empresas clientes e não os utilizamos
              para treinar modelos de IA próprios.
            </p>
            <p>
              <strong>Retenção e exclusão:</strong> os dados permanecem enquanto o canal estiver
              conectado e o contrato vigente. A empresa pode desconectar o canal a qualquer momento —
              o que revoga o token — e solicitar a eliminação do histórico. O passo a passo está na{' '}
              <Link to={EXCLUSAO_DADOS_PATH}>página de exclusão de dados</Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>5. Com quem compartilhamos (operadores)</h2>
            <p>Usamos provedores que processam dados sob nossa instrução:</p>
            <ul>
              <li>
                <strong>Infraestrutura</strong> — hospedagem da aplicação e banco Postgres onde as
                respostas do diagnóstico são armazenadas.
              </li>
              <li>
                <strong>Resend</strong> — envio do relatório e avisos internos por e-mail.
              </li>
              <li>
                <strong>Anthropic</strong> — geração do texto do relatório a partir das respostas
                (sem finalidade de marketing do provedor sobre o seu caso).
              </li>
              <li>
                <strong>Cloudflare Turnstile</strong> — verificação anti-bot.
              </li>
              <li>
                <strong>Google Analytics</strong> — analytics do site (somente com consentimento).
              </li>
              <li>
                <strong>Upstash</strong> — limites de taxa / filas técnicas, quando habilitado.
              </li>
              <li>
                <strong>Meta</strong> — entrega das mensagens nos canais WhatsApp e Instagram, pelas
                APIs oficiais, quando a empresa conecta esses canais no Dupply Atende.
              </li>
              <li>
                <strong>Provedores de IA (Anthropic, Google, OpenAI)</strong> — geração das respostas
                assistidas, conforme o modelo configurado. Os provedores tratam o conteúdo apenas
                para responder à solicitação, sem finalidade publicitária.
              </li>
              <li>
                <strong>Cloudflare R2</strong> — armazenamento privado das mídias recebidas nas
                conversas.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Base legal e retenção</h2>
            <p>
              Tratamos dados com base na execução de solicitação sua (receber o diagnóstico /
              contato) e no legítimo interesse de operar, medir e proteger o serviço, sempre de
              forma proporcional.
            </p>
            <p>
              Mantemos registros do diagnóstico enquanto forem necessários para atendimento,
              histórico comercial legítimo e obrigações legais. Você pode pedir exclusão ou
              correção pelos canais da seção 1.
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Seus direitos (LGPD)</h2>
            <p>Você pode solicitar, entre outros:</p>
            <ul>
              <li>confirmação de tratamento e acesso aos dados;</li>
              <li>correção de dados incompletos ou desatualizados;</li>
              <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>informação sobre compartilhamentos;</li>
              <li>revogação de consentimento, quando aplicável.</li>
            </ul>
            <p>
              Para pedir a eliminação dos seus dados, siga o passo a passo da{' '}
              <Link to={EXCLUSAO_DADOS_PATH}>página de exclusão de dados</Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Cookies e armazenamento local</h2>
            <p>Usamos três categorias simples:</p>
            <ul>
              <li>
                <strong>Necessários</strong> — tema claro/escuro e rascunho do diagnóstico no seu
                navegador. O site precisa deles para funcionar; não pedimos opt-in.
              </li>
              <li>
                <strong>Analytics</strong> — Google Analytics 4 (IP anonimizado), só depois que você
                clica em “Aceitar todos” no aviso de cookies.
              </li>
              <li>
                <strong>Preferência de cookies</strong> — guardamos sua escolha (aceitar / apenas
                necessários) no <code>localStorage</code> para não repetir o aviso a cada visita.
              </li>
            </ul>
            <p>
              Você pode mudar a escolha a qualquer momento:{' '}
              <button
                type="button"
                className="legal-text-btn"
                onClick={() => openCookieConsentPreferences()}
              >
                gerenciar cookies
              </button>
              .
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Atualizações</h2>
            <p>
              Podemos atualizar esta política quando o produto ou a base legal mudarem. A data no
              topo desta página indica a versão vigente.
            </p>
          </section>

          <p className="legal-cta">
            Quer conhecer o diagnóstico?{' '}
            <Link to={DIAGNOSTICO_PATH}>Começar o diagnóstico gratuito</Link>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
