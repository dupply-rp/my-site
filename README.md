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
  ROADMAP.md      Roadmap das fases de evolução
documentacao.md   Documentação completa — site, sistema, fases e identidade visual
```

## Documentação

- **[documentacao.md](./documentacao.md)** — o que existe hoje, como funciona, variáveis, deploy e plano da Fase 1 (landing)
- **[docs/ROADMAP.md](./docs/ROADMAP.md)** — fases do produto (landing → SaaS → WhatsApp)

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

| Fase | Foco | Status |
|------|------|--------|
| Infra + Diagnóstico (A, A.2, B) | Backend, console, relatório duplo, CTAs | ✅ Concluído |
| **Fase 1** | Landing page — responsividade e identidade visual | 🔜 Próxima |
| Fase 2 | Billing, Clerk, CRM | Pendente |
| Fase 3 | WhatsApp | Pendente |

Detalhes em [documentacao.md](./documentacao.md) e [docs/ROADMAP.md](./docs/ROADMAP.md).
