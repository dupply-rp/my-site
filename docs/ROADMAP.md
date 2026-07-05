# Roadmap — Plataforma Dupply

Evolução da arquitetura em fases. A **Fase 0** está em implementação nesta branch.

## Fase 0 — Monorepo com fronteiras claras ✅ (em andamento)

**Objetivo:** reorganizar o código sem mudar comportamento.

- [x] Monorepo com pnpm workspaces + Turborepo
- [x] `apps/web` — site institucional + diagnóstico (Vite + React)
- [x] `apps/api` — handlers serverless (Vercel Edge)
- [x] `api/` na raiz — wrappers finos para compatibilidade com rotas `/api/*` da Vercel
- [x] `packages/types` — contratos compartilhados (diagnóstico)
- [x] `packages/ui` — scaffold do design system
- [x] `packages/config` — tsconfig e eslint compartilhados

**Comandos:**

```bash
pnpm install
pnpm dev          # frontend (apps/web)
pnpm dev:api      # frontend + API local (vercel dev)
pnpm build        # build de produção
```

---

## Fase 1 — Fundações da plataforma SaaS

**Objetivo:** sair do Google Sheets e preparar multi-tenancy.

- [ ] **TODO:** Postgres (Supabase/Neon/Vercel Postgres) + ORM (Drizzle ou Prisma)
- [ ] **TODO:** Schema multi-tenant (`tenant_id` em todas as tabelas)
- [ ] **TODO:** Autenticação (Clerk, Auth.js ou Supabase Auth)
- [ ] **TODO:** Migrar dados do diagnóstico do Google Sheets para o banco
- [ ] **TODO:** Criar `apps/console` — shell da área logada (layout, navegação, módulos lazy)
- [ ] **TODO:** Extrair lógica duplicada (scoring, questions, buildSummary) para `packages/diagnostico` ou similar
- [ ] **TODO:** SDK tipado da API em `packages/sdk`

---

## Fase 2 — Billing e primeiro módulo SaaS

**Objetivo:** monetização e primeiro produto no console.

- [ ] **TODO:** Stripe — assinaturas e controle de entitlements por produto
- [ ] **TODO:** Módulo CRM / gestão de clientes no `apps/console`
- [ ] **TODO:** Painel admin interno (`apps/admin`) para gestão dos seus clientes
- [ ] **TODO:** Unificar `@dupply/ui` com componentes reais (Button, Input, Layout, etc.)

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

Gatilhos para considerar split:
- Times separados bloqueando deploy uns dos outros
- Cadência de deploy independente por produto
- Gargalo de escala isolado em um domínio

- [ ] **TODO:** Avaliar Module Federation (Vite) para produtos com deploy independente
- [ ] **TODO:** Extrair domínios críticos (ex.: WhatsApp) para serviço dedicado
- [ ] **TODO:** Observabilidade centralizada (logs, métricas, tracing)

---

## Estrutura alvo

```
apps/
  web/       → dupply.com.br (marketing + ferramentas públicas)
  console/   → SaaS multi-produto (Fase 1+)
  api/       → backend serverless
  admin/     → painel interno Dupply (Fase 2+)

packages/
  types/     → contratos compartilhados
  ui/        → design system
  config/    → eslint + tsconfig
  sdk/       → client tipado da API (Fase 1+)
  db/        → schema + migrations (Fase 1+)

api/         → wrappers Vercel (rotas /api/*)
analytics/   → scripts Google Sheets / docs
scripts/     → smoke tests e automações
```
