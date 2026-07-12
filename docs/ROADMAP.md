# Roadmap — Plataforma Dupply

Evolução da arquitetura em fases.

## Fase 0 — Monorepo com fronteiras claras ✅ (concluída)

**Objetivo:** reorganizar o código sem mudar comportamento.

- [x] Monorepo com pnpm workspaces + Turborepo
- [x] `apps/web` — site institucional + diagnóstico (Vite + React)
- [x] `apps/api` — handlers serverless (Vercel Edge)
- [x] `api/` na raiz — wrappers finos para compatibilidade com rotas `/api/*` da Vercel
- [x] `packages/types` — contratos compartilhados (diagnóstico)
- [x] `packages/ui` — scaffold do design system
- [x] `packages/config` — tsconfig e eslint compartilhados

---

## Fase 1 — Fundações da plataforma SaaS ✅ (concluída)

**Objetivo:** sair do Google Sheets e preparar multi-tenancy.

- [x] Postgres (Neon via Vercel Marketplace) + ORM (Drizzle)
- [x] Schema multi-tenant (`tenants` + `tenant_id` em diagnósticos)
- [x] Autenticação do console (JWT com `CONSOLE_SECRET` + filtro por tenant)
- [x] Script de migração Sheets → banco (`pnpm db:import-sheets`)
- [x] `apps/console` — shell com navegação e módulo de diagnósticos
- [x] `packages/diagnostico` — lógica unificada (scoring, questions, buildSummary)
- [x] `packages/sdk` — client tipado da API do console
- [x] Banco como fonte principal (planilha opcional via `ENABLE_GOOGLE_SHEETS=true`)

**Comandos:**

```bash
pnpm db:push
pnpm db:studio
pnpm db:import-sheets ./diagnosticos.csv
pnpm dev:local          # API + console
```

**Produção:** configure `CONSOLE_SECRET` e `DATABASE_URL` na Vercel.

**Após deploy da Fase A (relatório duplo):** rode `pnpm db:push` com `DATABASE_URL` para criar `relatorio_cliente` e `relatorio_interno`.

**Próximo passo natural (Fase 2):** Clerk para clientes externos, Stripe, CRM.

---

## Fase 2 — Billing e primeiro módulo SaaS

**Objetivo:** monetização e primeiro produto no console.

- [ ] **TODO:** Stripe — assinaturas e controle de entitlements por produto
- [ ] **TODO:** Módulo CRM / gestão de clientes no `apps/console`
- [ ] **TODO:** Painel admin interno (`apps/admin`) para gestão dos seus clientes
- [ ] **TODO:** Unificar `@dupply/ui` com componentes reais (Button, Input, Layout, etc.)
- [ ] **TODO:** Clerk (ou Auth.js) para login de clientes com organizações = tenants

---

## Fase 3 — Módulo WhatsApp

**Objetivo:** atendimento via WhatsApp como produto SaaS.

- [ ] **TODO:** Backend persistente para webhooks e jobs (Hono/Fastify/NestJS em container)
- [ ] **TODO:** Filas de mensagens (Upstash Redis / BullMQ)
- [ ] **TODO:** Integração com Meta Cloud API ou provedor (Z-API, Twilio)
- [ ] **TODO:** UI de atendimento em tempo real no `apps/console`
- [ ] **TODO:** Websockets ou SSE para inbox ao vivo

---

## Fase 4+ — Escala e split (somente se necessário)

**Objetivo:** micro-frontend / microserviço apenas quando houver gatilho concreto.

- [ ] **TODO:** Avaliar Module Federation (Vite) para produtos com deploy independente
- [ ] **TODO:** Extrair domínios críticos (ex.: WhatsApp) para serviço dedicado
- [ ] **TODO:** Observabilidade centralizada (logs, métricas, tracing)

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
