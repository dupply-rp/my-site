# Dupply — Plataforma

Monorepo da Dupply: site institucional, API serverless e pacotes compartilhados.

## Estrutura

```
apps/
  web/       Site (dupply.com.br) — Vite + React
  api/       Handlers serverless (código-fonte)
api/         Wrappers Vercel para rotas /api/*
packages/
  types/     Contratos TypeScript compartilhados
  ui/        Design system (scaffold)
  config/    ESLint + TSConfig compartilhados
docs/
  ROADMAP.md Roadmap das fases de evolução
```

## Desenvolvimento

Requisitos: Node 20+, pnpm 9+

```bash
pnpm install
pnpm dev          # frontend em http://localhost:5173
pnpm dev:api      # frontend + API local (vercel dev)
pnpm build        # build de produção
pnpm lint         # lint em todos os pacotes
```

Variáveis de ambiente: copie `.env.example` para `.env.local` na raiz.

## Roadmap

Ver [docs/ROADMAP.md](./docs/ROADMAP.md) para as fases de evolução (SaaS, multi-tenant, WhatsApp, etc.).
