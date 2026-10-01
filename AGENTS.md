# AGENTS.md

## Cursor Cloud specific instructions

Monorepo pnpm + Turborepo (`dupply`), TypeScript, deploy na Vercel. Requer Node 20+ e pnpm 9+ (já presentes). Dependências são instaladas automaticamente pelo update script (`pnpm install`).

Produtos/serviços (comandos padrão em `README.md` e no `package.json` raiz):
- `@dupply/web` — site institucional + Diagnóstico de IA (Vite/React). Dev: `pnpm dev` → http://localhost:5173. Este é o serviço principal e roda sem nenhum secret.
- `@dupply/console` — console admin (Vite/React). Dev: `pnpm dev:console`. Em produção é servido em `/console` (build copiado para `apps/web/dist/console`).
- `@dupply/api` — funções serverless da Vercel (handler do diagnóstico, auth/dados do console, cron). Rodam via `vercel dev`, não como servidor Node comum.

Notas não óbvias:
- `pnpm dev:api` e `pnpm dev:local` executam `vercel dev`, que **exige login na Vercel** (mostra um device-code em `vercel.com/oauth/device`) e um projeto linkado. Sem `VERCEL_TOKEN` + `.vercel` linkado isso fica bloqueado no ambiente cloud. Para o frontend basta `pnpm dev`.
- Scripts que usam `dotenv -e .env.local` (`dev:api`, `db:import-sheets`) exigem um arquivo `.env.local` na raiz (gitignored). Copie de `.env.example`. Sem ele, esses comandos falham antes de rodar.
- Degradação graciosa: com o backend indisponível, o Diagnóstico de IA cai num **relatório de fallback gerado no cliente** (via `@dupply/diagnostico`). O fluxo do quiz funciona ponta a ponta só com `pnpm dev`; o relatório mostra um aviso de que a IA não gerou o texto completo — isso é esperado sem `ANTHROPIC_API_KEY`.
- Rota de teste rápida: `http://localhost:5173/TC_teste` gera um relatório instantâneo a partir de respostas aleatórias (útil para smoke test da UI). Turnstile só é ativado se `VITE_TURNSTILE_SITE_KEY` estiver definido.
- Para exercitar o fluxo completo (relatório com IA de verdade, persistência e Console) são necessários secrets: `ANTHROPIC_API_KEY`, `DATABASE_URL` (Neon; depois `pnpm db:push`), `CONSOLE_SECRET` (auth do console retorna 503 sem ele). `RESEND_API_KEY`, Upstash, Turnstile e Google Sheets são opcionais e degradam graciosamente.
- Lint (`pnpm lint`): há um erro de código **pré-existente** em `apps/console/src/pages/NotifyEmailsPage.tsx` (`react-hooks/set-state-in-effect`), não relacionado ao ambiente. Os demais pacotes passam no lint.
