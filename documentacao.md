# Documentação Dupply — Site e Sistema

Documento central da plataforma Dupply (`dupply.com.br`): o que existe hoje, como funciona e o plano de evolução.

---

## Índice

1. [Visão geral](#visão-geral)
2. [Fases do projeto](#fases-do-projeto)
3. [Identidade visual](#identidade-visual)
4. [Site público (`apps/web`)](#site-público-appsweb)
5. [Diagnóstico de IA](#diagnóstico-de-ia)
6. [Console interno (`apps/console`)](#console-interno-appsconsole)
7. [API e backend](#api-e-backend)
8. [Banco de dados](#banco-de-dados)
9. [E-mails (Resend)](#e-mails-resend)
10. [Variáveis de ambiente](#variáveis-de-ambiente)
11. [Deploy e testes](#deploy-e-testes)
12. [Fase 1 — Landing page (próxima)](#fase-1--landing-page-próxima)

---

## Visão geral

A Dupply é uma plataforma em monorepo **pnpm** com:

| Parte | URL / caminho | Função |
|-------|---------------|--------|
| **Site** | https://www.dupply.com.br | Landing page + diagnóstico público |
| **Console** | https://www.dupply.com.br/console | Painel interno da equipe |
| **API** | `/api/*` | Serverless na Vercel |

### Estrutura do repositório

```
apps/
  web/       → Site (Vite + React) — landing + diagnóstico
  console/   → Console interno (React SPA em /console)
  api/       → Código-fonte dos handlers serverless

packages/
  types/        → Contratos TypeScript compartilhados
  diagnostico/  → Lógica do quiz (scoring, perguntas, relatório)
  sdk/          → Client tipado da API do console
  db/           → Schema Postgres + Drizzle ORM
  ui/           → Design system (scaffold — ainda vazio)
  config/       → ESLint + TSConfig compartilhados

api/         → Wrappers finos para rotas /api/* na Vercel
scripts/     → Smoke tests, bundles esbuild, import Sheets
docs/        → ROADMAP.md
```

### Stack

- **Frontend:** React 19, React Router, Vite
- **Backend:** Vercel Serverless Functions (Node)
- **Banco:** Postgres (Neon) + Drizzle ORM
- **IA:** Anthropic Claude (relatório do diagnóstico)
- **E-mail:** Resend
- **Captcha:** Cloudflare Turnstile
- **Rate limit:** Upstash Redis
- **Deploy:** Vercel (build unificado `pnpm build:vercel`)

---

## Fases do projeto

### Histórico — o que já foi feito

| Fase | Nome | Status |
|------|------|--------|
| **Infra 0** | Monorepo com fronteiras claras | ✅ Concluída |
| **Infra 1** | Fundações SaaS (Postgres, console, SDK, multi-tenant) | ✅ Concluída |
| **Diag. A** | Relatório duplo (cliente vs interno) | ✅ Concluída |
| **Diag. A.2** | `/TC_teste`, e-mails, menu E-mails no console | ✅ Concluída |
| **Diag. B** | CTAs, solicitar contato, Ferramentas/Roadmap no console | ✅ Concluída |

### Roadmap atualizado (a partir de agora)

| Fase | Nome | Status |
|------|------|--------|
| **Fase 1** | **Landing page** — responsividade, layout, identidade visual | 🔜 Próxima |
| **Fase 2** | Billing e primeiro módulo SaaS (Stripe, Clerk, CRM) | ⬜ Pendente |
| **Fase 3** | Módulo WhatsApp | ⬜ Pendente |
| **Fase 4+** | Escala e split (microserviços, observabilidade) | ⬜ Pendente |

Detalhes em [docs/ROADMAP.md](./docs/ROADMAP.md).

---

## Identidade visual

Guia oficial da marca Dupply.

### Cores

| Nome | HEX | RGB | Uso sugerido |
|------|-----|-----|--------------|
| **Preto 70%** | `#1C2628` | 28, 38, 40 | Fundo escuro, textos em fundo claro |
| **Off White** | `#F2F3F5` | 242, 243, 245 | Fundo claro, textos em fundo escuro |
| **Azul-violeta** | `#5E62C5` | 94, 98, 197 | Cor secundária, gradientes |
| **Azul ultramarino** | `#0215FC` | 2, 21, 252 | CTA, links, destaques |

**Gradiente da marca:** `#5E62C5` → `#0215FC` (azul-violeta para ultramarino).

### Tipografia

- **Família:** [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)
- **Pesos:** Extra Light (200), Light (300), Regular (400), Medium (500), Semi-Bold (600), Bold (700)
- **Logo:** `dupply` em minúsculas
- **Tagline:** *"Aprenda construindo no mercado real"*

### Situação atual no código

O site já carrega Outfit (300–700), mas as **cores CSS não seguem o guia**:

| Token atual (`landing.css`) | Valor atual | Deveria ser |
|-----------------------------|-------------|-------------|
| `--bg` | `#f7f8fb` | `#F2F3F5` (Off White) |
| `--ink` | `#10151d` | `#1C2628` (Preto 70%) |
| `--blue` | `#0718ff` | `#0215FC` (Ultramarino) |
| `--blue-2` | `#2d73ff` | `#5E62C5` (Azul-violeta) |
| Gradiente CTA | azuis genéricos | `#5E62C5` → `#0215FC` |

A paleta do guia sugere um visual mais **escuro e premium** (fundo `#1C2628`), enquanto o site hoje usa tema **claro genérico** — principal motivo do aspecto amador.

---

## Site público (`apps/web`)

### Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `HomePage` | Landing page institucional |
| `/diagnostico` | `DiagnosticoPage` | Questionário + relatório de IA |
| `/TC_teste` | `DiagnosticoTestPage` | Modo teste (dados aleatórios `TC_`) |

### Landing page — seções (ordem)

| # | Componente | ID âncora | Conteúdo |
|---|------------|-----------|----------|
| — | `Header` | — | Nav sticky (só ≤980px) |
| 1 | `MockupHero` | `#top` | Hero desktop — **imagem PNG com hotspots** |
| 2 | `ResponsiveHero` | — | Hero mobile/tablet — HTML semântico |
| 3 | `DiagnosisSection` | `#gargalos` | 6 cards de perdas de tempo |
| 4 | `DiagnosticoBanner` | — | CTA do diagnóstico gratuito |
| 5 | `TrajectorySection` | `#trajetoria` | Bio do CEO + empresas |
| 6 | `ProcessSection` | `#atuacao` | 5 etapas do processo |
| 7 | `BenefitsSection` | `#beneficios` | 6 benefícios |
| 8 | `FinalCtaSection` | — | CTA final com gradiente |
| — | `Footer` | — | Contato + Instagram |

### Arquivos principais

```
apps/web/src/
  pages/HomePage.tsx              → Composição da landing
  styles/landing.css              → ~1.200 linhas de CSS global
  components/layout/Header.tsx    → Navegação
  components/layout/Footer.tsx    → Rodapé
  components/sections/*.tsx       → Seções da página
  constants/content.ts            → Textos (cards, steps, etc.)
  constants/links.ts              → WhatsApp, paths
```

### Estilização

- **Sem Tailwind** — CSS global em `landing.css`
- **Tokens CSS** em `:root` (`--bg`, `--ink`, `--blue`, etc.)
- **Breakpoints:** 1080px, 980px, 760px, 420px

### Problemas conhecidos (landing)

#### Responsividade

1. **Dois heroes diferentes** — acima de 980px usa imagem PNG (`MockupHero`); abaixo usa HTML (`ResponsiveHero`). Troca brusca de layout.
2. **Sem navegação no desktop** — `Header` fica `display: none` acima de 980px; links existem só como hotspots invisíveis na imagem.
3. **Overflow no tablet (761–980px)** — cards `.promise` com `right: -44px` saem do container e são cortados.
4. **Altura fixa no hero visual** — `min-height: 610px` deixa área vazia em tablets.
5. **Botões com `white-space: nowrap`** — textos longos estouram em telas médias.
6. **`mockup-stage` com `min-width: 980px`** — pode gerar scroll horizontal.

#### Layout / aspecto amador

1. **Hero desktop é um hack** — página inteira como PNG com áreas clicáveis por cima, em vez de componentes reais.
2. **Paleta fora do guia** — cores genéricas de template SaaS claro.
3. **Tagline da marca ausente** — *"Aprenda construindo no mercado real"* não aparece.
4. **CSS monolítico** — 1.200 linhas num único arquivo, difícil de manter.
5. **Seções genéricas** — grids de cards sem hierarquia visual forte.
6. **CSS morto** — classes `.editorial`, `.section-cta` definidas mas não usadas.

---

## Diagnóstico de IA

### Fluxo do usuário

1. Acessa `/diagnostico` (ou CTA na landing)
2. Preenche questionário (empresa, setor, dores, etc.)
3. Passa pelo Turnstile (anti-bot)
4. API gera relatório com Claude (fallback automático se IA falhar)
5. Vê relatório na tela com score, pilares e CTAs
6. Pode solicitar contato ou ir ao WhatsApp

### Relatório duplo (Diag. A)

| Versão | Onde aparece | Conteúdo |
|--------|--------------|----------|
| **Cliente** | Site, e-mail, impressão | Diagnóstico macro, oportunidades, próximos passos — **sem** nomes de software |
| **Interno** | Console Dupply | Ferramentas recomendadas + roadmap de 90 dias |

### CTAs no relatório (Diag. B)

- **WhatsApp:** (77) 98829-6602
- **Peça para Dupply entrar em contato** → `POST /api/solicitar-contato`
- E-mail interno para a equipe quando lead solicita contato

### Modo teste (`/TC_teste`)

- Dados aleatórios com prefixo `TC_`
- Turnstile obrigatório
- Prévia do relatório cliente na tela
- Não substitui smoke test de produção

### Arquivos principais

```
packages/diagnostico/     → Scoring, perguntas, buildSummary
apps/web/src/features/diagnostico/
  DiagnosticoPage.tsx     → Fluxo principal
  DiagnosticoTestPage.tsx → /TC_teste
  components/             → Quiz, loading, relatório
apps/api/src/
  diagnostico-handler.entry.ts  → Handler principal
  lib/splitReport.ts            → Separa cliente/interno
  lib/prompt.ts                 → Prompt da IA
  solicitar-contato.ts          → Solicitação de contato
```

---

## Console interno (`apps/console`)

### Acesso

- URL: https://www.dupply.com.br/console
- Login: senha única (`CONSOLE_SECRET` na Vercel)
- JWT assinado com `jose` — sessão por tenant (`dupply` por padrão)

### Módulos

| Rota | Função |
|------|--------|
| `/console` | Lista de diagnósticos |
| `/console/diagnosticos/:id` | Detalhe — relatório cliente + seção interna (Ferramentas/Roadmap) |
| `/console/emails` | Cadastro de destinatários de notificação |

### O que o console mostra por diagnóstico

- Dados do lead (empresa, e-mail, telefone, setor, score)
- **Relatório cliente** — visão que o lead recebeu
- **Ferramentas e roadmap** — seção interna (badge "Uso interno")
- Botão imprimir

---

## API e backend

### Endpoints principais

| Método | Rota | Função |
|--------|------|--------|
| `POST` | `/api/diagnostico-handler` | Gera diagnóstico (quiz → IA → banco → e-mails) |
| `POST` | `/api/solicitar-contato` | Lead pede contato (rewrite → diagnostico-handler) |
| `POST` | `/api/console/auth` | Login do console |
| `GET` | `/api/console/diagnosticos` | Lista diagnósticos |
| `GET` | `/api/console/diagnosticos/:id` | Detalhe |
| `GET/POST/DELETE` | `/api/console/notify-emails` | CRUD e-mails de notificação |
| `POST` | `/api/diagnostico/smoke` | Smoke test (requer `DIAGNOSTICO_TEST_SECRET`) |

### Bundles esbuild

A API em produção usa bundles pré-compilados (não importa TypeScript direto):

```
api/diagnostico-handler.bundle.js   → Diagnóstico + solicitar-contato
api/console/diagnosticos.bundle.js  → Console API + notify-emails
api/diagnostico/smoke.bundle.js     → Smoke test
```

Rebuild: `pnpm build:api`

### Proteções

- **Turnstile** — captcha no diagnóstico
- **Rate limit** — por IP via Upstash (5 req/hora padrão)
- **Honeypot** — campo `website` oculto
- **Modo teste** — só aceita nomes com prefixo `TC_`

---

## Banco de dados

### Tabelas

| Tabela | Campos principais |
|--------|-------------------|
| `tenants` | `id`, `name`, `slug` |
| `diagnosticos` | lead, score, `relatorio`, `relatorio_cliente`, `relatorio_interno`, `ai_generated` |
| `diagnostico_respostas` | respostas por pergunta |
| `notify_emails` | destinatários de notificação por tenant |

### Comandos

```bash
pnpm db:push          # Aplica schema no Postgres
pnpm db:studio        # UI do Drizzle
pnpm db:import-sheets # Importa CSV legado do Sheets
```

---

## E-mails (Resend)

### Quando disparam

| Evento | Destinatário | Função |
|--------|--------------|--------|
| Novo diagnóstico | Equipe (`notify_emails`) | `sendLeadNotificationEmail` |
| Novo diagnóstico | Cliente (se e-mail válido) | `sendReportEmail` |
| Solicitar contato | Equipe | `sendContactRequestEmail` |

### Configuração necessária (Vercel Production)

```
RESEND_API_KEY=re_...
REPORT_EMAIL_FROM=Diagnóstico Dupply <relatorio@dupply.com.br>
```

- Domínio `dupply.com.br` verificado em https://resend.com/domains
- Sem aspas nos valores
- **Redeploy** após alterar variáveis
- Destinatários em `/console/emails` ou `DIAGNOSTICO_NOTIFY_EMAILS`

### Teste de e-mail

```bash
curl -X POST "https://www.dupply.com.br/api/diagnostico/smoke?mode=email" \
  -H "Authorization: Bearer $DIAGNOSTICO_TEST_SECRET"
```

---

## Variáveis de ambiente

Referência completa em [`.env.example`](./.env.example).

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | Sim (prod) | Postgres Neon |
| `CONSOLE_SECRET` | Sim (prod) | Login do console |
| `ANTHROPIC_API_KEY` | Sim (prod) | Relatório com IA |
| `RESEND_API_KEY` | Para e-mails | Envio Resend |
| `REPORT_EMAIL_FROM` | Para e-mails | Remetente |
| `TURNSTILE_SECRET_KEY` | Sim (prod) | Captcha servidor |
| `VITE_TURNSTILE_SITE_KEY` | Sim (prod) | Captcha frontend |
| `UPSTASH_REDIS_REST_URL` | Recomendado | Rate limit |
| `UPSTASH_REDIS_REST_TOKEN` | Recomendado | Rate limit |
| `DIAGNOSTICO_TEST_SECRET` | Para smoke | Testes em produção |

---

## Deploy e testes

### Build de produção

```bash
pnpm build:vercel
# = build:api + web + console
```

### Deploy

- Hospedagem: **Vercel**
- Domínio: `www.dupply.com.br` (usar `www` — redirect remove Authorization em alguns casos)
- Output: `apps/web/dist` + functions em `api/`

### Smoke test

```bash
pnpm test:diagnostico:prod
# Lê .env.local automaticamente
# POST https://www.dupply.com.br/api/diagnostico/smoke?mode=full
```

### Desenvolvimento local

```bash
pnpm install
cp .env.example .env.local   # preencher valores
pnpm db:push
pnpm dev                     # site em :5173
pnpm dev:api                 # API local (vercel dev :3000)
pnpm dev:local               # API + console juntos
```

---

## Fase 1 — Landing page (próxima)

### Objetivo

Transformar https://www.dupply.com.br em uma landing **profissional, mobile-first e alinhada à marca**, antes de avançar para billing/SaaS (Fase 2).

### Escopo proposto

#### 1. Design system da landing

- [ ] Substituir tokens CSS pelas cores oficiais (`#1C2628`, `#F2F3F5`, `#5E62C5`, `#0215FC`)
- [ ] Gradiente da marca em CTAs e destaques
- [ ] Escala tipográfica Outfit (200–700) com hierarquia clara
- [ ] Tagline *"Aprenda construindo no mercado real"* no header/hero
- [ ] Decidir tema: **escuro** (guia de cores) ou **claro** (Off White) — recomendação: escuro com Off White para texto

#### 2. Hero unificado (eliminar MockupHero)

- [ ] Remover abordagem de imagem PNG + hotspots
- [ ] Um único componente `Hero` responsivo com HTML/CSS real
- [ ] Header sempre visível (desktop + mobile)
- [ ] CTA primário (ultramarino) + secundário (outline)

#### 3. Responsividade mobile-first

- [ ] Refatorar breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- [ ] Corrigir overflow dos cards promise
- [ ] Botões empilhados em mobile, lado a lado em desktop
- [ ] Touch targets ≥ 44px
- [ ] Testar em 375px, 390px, 768px, 1024px

#### 4. Seções — polish visual

- [ ] **Gargalos** — ícones ou ilustrações nos cards de perda
- [ ] **Banner diagnóstico** — destaque maior, contraste com gradiente da marca
- [ ] **Trajetória** — foto do CEO com tratamento visual da marca
- [ ] **Processo** — timeline vertical em mobile, horizontal em desktop
- [ ] **Benefícios** — grid 2×3 → 1 coluna em mobile
- [ ] **CTA final** — gradiente `#5E62C5` → `#0215FC`

#### 5. Código e manutenção

- [ ] Extrair tokens para `packages/ui` ou `apps/web/src/styles/tokens.css`
- [ ] Dividir `landing.css` por seção ou migrar para CSS Modules
- [ ] Remover CSS morto (`.editorial`, `.section-cta`)
- [ ] Componentizar: `Button`, `Card`, `Section`, `Container`

#### 6. Performance e SEO

- [ ] Remover imagem hero PNG pesada (~1400×900)
- [ ] `theme-color` meta → `#1C2628`
- [ ] Manter JSON-LD e skip link
- [ ] Lighthouse mobile ≥ 90

### Critérios de aceite

- [ ] Navegação funcional em todas as larguras (320px–1440px+)
- [ ] Cores e tipografia conforme guia da marca
- [ ] Sem scroll horizontal em nenhum breakpoint
- [ ] Visual consistente com identidade Dupply (não "template genérico")
- [ ] CTAs claros: WhatsApp + Diagnóstico gratuito

### Ordem de implementação sugerida

1. Tokens de cor e tipografia
2. Header unificado + Hero novo
3. Corrigir responsividade seção a seção (top → bottom)
4. CTA final + footer
5. Limpeza de código e testes visuais

---

## Links úteis

- **Site:** https://www.dupply.com.br
- **Console:** https://www.dupply.com.br/console
- **Diagnóstico:** https://www.dupply.com.br/diagnostico
- **Resend (domínios):** https://resend.com/domains
- **Fonte Outfit:** https://fonts.google.com/specimen/Outfit
- **Roadmap técnico:** [docs/ROADMAP.md](./docs/ROADMAP.md)
