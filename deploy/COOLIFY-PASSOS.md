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
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Marque `VITE_*` como **Available at Buildtime** (precisam no build do Vite).

### Advanced

- **Connect To Predefined Network:** ativar (para o nginx resolver o alias da API na rede `coolify`)

### Nginx

Static Site → Custom Nginx Configuration → cole `deploy/nginx-my-site.conf` (já aponta para o alias `my-site-api`).

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

- **Connect To Predefined Network:** **ativar** (obrigatório para enxergar o Postgres e o site)
- **Custom Network Aliases:** `my-site-api`  
  (hostname DNS estável na rede Docker — apps **não** resolvem pelo UUID curto; só databases têm hostname = UUID)

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

1. Confirme no `my-site-api` o alias `my-site-api` (Passo 1) e **Connect To Predefined Network** nos dois apps.
2. No `my-site` → Nginx custom → cole `deploy/nginx-my-site.conf` (resolver + `$api_upstream` → `http://my-site-api:3000`).
3. **Redeploy** os dois apps (alias/rede só entram em vigor no deploy).

Validar no Terminal do `my-site`:

```sh
getent hosts my-site-api
curl -sS http://my-site-api:3000/api/health
```

Teste pelo domínio/sslip do site:

```sh
curl -s http://SEU-DOMINIO/api/health
# esperado: {"ok":true,"service":"dupply-diagnostico"}
```

**Armadilha:** o UUID do app (`n7ij7ywo…`) **não** é hostname Docker estável. Use o alias. Confira também `l` vs `1` no UUID ao copiar URLs sslip.

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

## Passo 6 — DNS Cloudflare + HTTPS + `vps.dupply.com.br`

Seguir **[`deploy/DNS-CLOUDFLARE.md`](DNS-CLOUDFLARE.md)** (inventário + zona Cloudflare + Registro.br).

Já feito no Coolify:

- FQDN `my-site`: `https://dupply.com.br`, `https://www.dupply.com.br` (+ sslip de fallback)
- `VITE_SITE_URL=https://dupply.com.br`

Você ainda precisa:

1. Criar zona Cloudflare e trocar NS no Registro.br
2. Settings Coolify → Instance Domain = `https://vps.dupply.com.br`
3. Validar `https://dupply.com.br/api/health` após propagação

**Não** cancelar Vercel até migrar `dash` / `imob` / etc.

---

## Erros comuns

| Aviso / erro | Causa | Correção |
| --- | --- | --- |
| PORT 3000 vs 80 | Env da API no site estático | Passo 0 |
| NODE_ENV production no build | `NODE_ENV` em Buildtime no site | Remover ou Runtime only no `my-site` |
| Node 18 EOL | Nixpacks default | `NIXPACKS_NODE_VERSION=22` |
| API não conecta no banco | Rede Docker | Connect To Predefined Network na API |
| 502 em `/api/*` | Nginx sem proxy, UUID errado (`l`/`1`), ou sem alias | Passo 1 alias + Passo 3 |
| `nslookup <uuid>` → SERVFAIL | UUID de **app** não é DNS estável | Usar Custom Network Aliases (`my-site-api`) |
| Nginx Exited 10/11 | `proxy_pass` com hostname fixo sem variável | Usar `resolver` + `set $api_upstream` |
| Let's Encrypt falha | DNS ainda na Vercel / proxy Cloudflare laranja | Aguardar NS + nuvem cinza no apex |
