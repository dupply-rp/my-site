# Passo a passo Coolify — Dupply my-site + API + Postgres

Execute **na ordem**. Repo: `dupply-rp/my-site`, branch `main`.

Envs prontas para importar:
- API → `deploy/env.coolify-api.env` (ou seu `.env.producao` na raiz)
- Site → `deploy/env.coolify-site.env`

---

## Passo 0 — Corrigir o app `my-site` (site estático)

Você importou envs da **API** no site estático. Limpe isso primeiro.

### General

| Campo | Valor |
| --- | --- |
| Is it a static site? | **Sim** |
| Base Directory | `/` |
| Install Command | `pnpm install` |
| Build Command | `pnpm build:site` (compila types + diagnostico + web + console) |
| Publish Directory | `/apps/web/dist` |
| Port Exposes | **80** (não 3000) |

### Environment Variables

**Apague** do `my-site`: `PORT`, `DATABASE_URL`, `ANTHROPIC_*`, `RESEND_*`, `CONSOLE_*`, `TURNSTILE_SECRET_*`, `UPSTASH_*`, `CRON_*`, `ENABLE_GOOGLE_SHEETS`, `NODE_ENV`.

**Importe só** (`deploy/env.coolify-site.env`):

```env
NIXPACKS_NODE_VERSION=22
VITE_SITE_URL=https://dupply.com.br
VITE_TURNSTILE_SITE_KEY=seu-site-key
```

Marque `VITE_*` como **Available at Buildtime** (precisam no build do Vite).

### Advanced

- **Connect To Predefined Network:** ativar (para o nginx resolver o container da API depois)

### Nginx

Static Site → Custom Nginx Configuration → cole `deploy/nginx-my-site.conf` e troque `<API_CONTAINER>` **depois** que o Passo 2 estiver verde.

**Deploy** o `my-site`.

---

## Passo 1 — Criar app `my-site-api` (Node)

Dupply-site → production → **+ New** → Private Repository (GitHub App).

### General

| Campo | Valor |
| --- | --- |
| Repository | `dupply-rp/my-site` |
| Branch | `main` |
| Is it a static site? | **Não** |
| Base Directory | `/` |
| Install Command | `pnpm install` |
| Build Command | `pnpm build:server` |
| Start Command | `pnpm start:server` |
| Port Exposes | **3000** |

### Environment Variables

Importe **Developer view** → conteúdo de `deploy/env.coolify-api.env` (ou `.env.producao`):

- `DATABASE_URL` = URL interna do `db-diagnostico`
- `PORT=3000`, `NODE_ENV=production`
- Demais secrets (Anthropic, Resend, Turnstile, Upstash, Console, Cron)

**NODE_ENV:** pode ficar **Runtime only** (desmarque Buildtime se o build falhar por falta de devDependencies).

Adicione também:

```env
NIXPACKS_NODE_VERSION=22
```

### Advanced

- **Connect To Predefined Network:** **ativar** (obrigatório para enxergar o Postgres)

**Save → Deploy.** Aguarde status **Running** (verde).

---

## Passo 2 — Criar schema no Postgres

App `my-site-api` → **Terminal** (no navegador):

```sh
pnpm db:push:env
```

Deve criar tabelas no `db-diagnostico` sem erro.

Teste direto na API (URL interna ou temporária do Coolify):

```sh
curl -s http://localhost:3000/api/health
```

Esperado: `{"ok":true}` (ou equivalente).

---

## Passo 3 — Proxy `/api` no site

1. Na VPS (SSH) ou painel: descubra o nome do container da API:
   ```sh
   docker ps | grep my-site-api
   ```
2. No `my-site` → Nginx custom → substitua `<API_CONTAINER>` em `deploy/nginx-my-site.conf`
3. **Redeploy** só do `my-site` (ou reload nginx se o Coolify permitir)

Teste pelo domínio/sslip do site:

```sh
curl -s https://SEU-DOMINIO/api/health
```

---

## Passo 4 — Validar diagnóstico

- [ ] Site abre
- [ ] `/api/health` OK pelo domínio do site
- [ ] Formulário diagnóstico completo → resposta com `dbPending: false`
- [ ] `/console` login com `CONSOLE_SECRET`

---

## Passo 5 — Cron (opcional)

App `my-site-api` → Scheduled Tasks:

- Schedule: `0 9 * * *`
- Command: `curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/retry-sheets`

---

## Erros comuns

| Aviso / erro | Causa | Correção |
| --- | --- | --- |
| PORT 3000 vs 80 | Env da API no site estático | Passo 0 |
| NODE_ENV production no build | `NODE_ENV` em Buildtime no site | Remover ou Runtime only no `my-site` |
| Node 18 EOL | Nixpacks default | `NIXPACKS_NODE_VERSION=22` |
| API não conecta no banco | Rede Docker | Connect To Predefined Network na API |
| 502 em `/api/*` | Nginx sem proxy ou nome errado | Passo 3 |
