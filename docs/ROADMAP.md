# Roadmap — Plataforma Dupply

Evolução da arquitetura e do produto em fases.

> Documentação completa do que existe hoje: [documentacao.md](../documentacao.md)

---

## Concluído — Infraestrutura e diagnóstico

### Infra 0 — Monorepo ✅

- Monorepo pnpm + Turborepo
- `apps/web`, `apps/api`, `apps/console`
- `packages/types`, `packages/diagnostico`, `packages/sdk`, `packages/db`
- Wrappers Vercel em `api/`

### Infra 1 — Fundações SaaS ✅

- Postgres (Neon) + Drizzle ORM
- Multi-tenant (`tenants` + `tenant_id`)
- Console interno com JWT (`CONSOLE_SECRET`)
- Banco como fonte principal (Sheets opcional)
- SDK tipado da API

### Diagnóstico A — Relatório duplo ✅

- Relatório cliente (sem software/roadmap) vs interno (Ferramentas + Roadmap 90 dias)
- Colunas `relatorio_cliente`, `relatorio_interno`
- Prompt com marcadores `DUPPLY_CLIENT` / `DUPPLY_INTERNAL`

### Diagnóstico A.2 — Teste e e-mails ✅

- Rota `/TC_teste` com dados `TC_`
- E-mails em todo diagnóstico (cliente + equipe)
- Menu **E-mails** no console (`/console/emails`)
- Tabela `notify_emails`

### Diagnóstico B — CTAs e contato ✅

- CTAs destacados no relatório (WhatsApp + solicitar contato)
- `POST /api/solicitar-contato`
- Ferramentas/Roadmap no console para relatórios legados
- Link direto ao diagnóstico no e-mail interno

---

## Fase 1 — Landing page 🔜 (próxima)

**Objetivo:** site institucional profissional, mobile-first, com identidade visual da marca.

A maioria dos leads acessa pelo celular; o layout atual quebra em tablet/mobile e o desktop usa uma imagem PNG com hotspots em vez de componentes reais.

### Escopo

- [ ] Aplicar paleta oficial: Preto 70% `#1C2628`, Off White `#F2F3F5`, Azul-violeta `#5E62C5`, Ultramarino `#0215FC`
- [ ] Tipografia Outfit (200–700) com hierarquia clara
- [ ] Tagline *"Aprenda construindo no mercado real"*
- [ ] Hero unificado (remover `MockupHero` PNG + hotspots)
- [ ] Header/nav em todas as larguras
- [ ] Responsividade mobile-first (corrigir overflow, breakpoints, botões)
- [ ] Polish visual das seções (gargalos, processo, benefícios, CTAs)
- [ ] Refatorar CSS (`landing.css` → tokens + módulos)
- [ ] Performance: remover hero PNG pesado, Lighthouse mobile ≥ 90

Detalhes e critérios de aceite: [documentacao.md § Fase 1](../documentacao.md#fase-1--landing-page-próxima)

---

## Fase 2 — Billing e primeiro módulo SaaS

**Objetivo:** monetização e primeiro produto no console.

- [ ] Stripe — assinaturas e entitlements por produto
- [ ] Clerk (ou Auth.js) — login de clientes, organizações = tenants
- [ ] Módulo CRM / gestão de clientes no `apps/console`
- [ ] Painel admin interno (`apps/admin`)
- [ ] `@dupply/ui` — design system real (Button, Input, Layout)

---

## Fase 3 — Módulo WhatsApp

**Objetivo:** atendimento via WhatsApp como produto SaaS.

- [ ] Backend persistente para webhooks e jobs
- [ ] Filas de mensagens (Upstash Redis / BullMQ)
- [ ] Integração Meta Cloud API ou provedor (Z-API, Twilio)
- [ ] UI de atendimento em tempo real no console
- [ ] Websockets ou SSE para inbox ao vivo

---

## Fase 4+ — Escala e split

**Objetivo:** micro-frontend / microserviço quando houver gatilho concreto.

- [ ] Module Federation (Vite) para deploy independente
- [ ] Extrair domínios críticos (ex.: WhatsApp) para serviço dedicado
- [ ] Observabilidade centralizada (logs, métricas, tracing)

---

## Estrutura atual

```
apps/
  web/       → dupply.com.br (marketing + diagnóstico público)
  console/   → console interno (/console)
  api/       → backend serverless (código-fonte)

packages/
  types/        → contratos compartilhados
  diagnostico/  → lógica do quiz
  sdk/          → client tipado da API
  db/           → schema + Drizzle
  ui/           → design system (scaffold)
  config/       → eslint + tsconfig

api/         → wrappers Vercel (rotas /api/*)
scripts/     → smoke tests, import Sheets
```
