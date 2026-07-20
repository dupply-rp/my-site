# Deploy no Coolify (VPS)

Guia da migração Vercel → VPS (Ubuntu 24.04 + Coolify v4). Contexto: monorepo pnpm + Turborepo;
`apps/web` (site, SPA Vite), `apps/console` (console, SPA Vite servido em `/console`),
`apps/api` (backend do diagnóstico, antes Vercel Functions — agora serviço Node próprio).

## Arquitetura no VPS

| Recurso Coolify | O quê | Como |
| --- | --- | --- |
| `my-site` (static) | `apps/web` + `apps/console` | Nixpacks static + nginx |
| `my-site-api` (node) | servidor Express (`apps/api/dist/server.cjs`) | Nixpacks, porta 3000 |
| `db-diagnostico` | PostgreSQL 16 | rede interna Docker, sem exposição pública |

O front chama a API por caminho relativo (`/api/...`), então o nginx do site estático
faz proxy de `/api/` para o serviço da API (mesma origem, sem CORS).

## 1. App da API (`my-site-api`)

Criar novo Resource no mesmo projeto/ambiente (production):

- **Tipo:** Private Repository (GitHub App) → repo `dupply-rp/my-site`, branch `main`
- **Build Pack:** Nixpacks — **NÃO** marcar "Is it a static site"
- **Base Directory:** `/`
- **Install Command:** `pnpm install`
- **Build Command:** `pnpm build:server`
- **Start Command:** `pnpm start:server`
- **Port:** `3000`
- **Advanced → Connect To Predefined Network:** ativado (necessário para o nginx do site e o Postgres se enxergarem)

### Variáveis de ambiente da API

Colar no Developer view (mesma limpeza de antes: sem `VERCEL_*` e `TURBO_*`):

- `DATABASE_URL` = **Postgres URL (internal)** do `db-diagnostico` (host é o nome do container, ex.: `postgres://postgres:senha@<container>:5432/postgres`)
- `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `REPORT_EMAIL_FROM`
- `TURNSTILE_SECRET_KEY`, `CONSOLE_SECRET`, `CRON_SECRET`, `DEFAULT_TENANT_SLUG`, `NODE_ENV=production`, `PORT=3000`
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` (rate limit / fila de retry — **não** use `REDIS_URL`)
- `ENABLE_GOOGLE_SHEETS=false` (a menos que ainda use planilha)
- Credenciais do Google Sheets, se `ENABLE_GOOGLE_SHEETS=true`

Modelo de envs: `deploy/env.coolify-api.env` (app `my-site-api`) e `deploy/env.coolify-site.env` (app `my-site`, só build).

**Guia clicável:** `deploy/COOLIFY-PASSOS.md` (ordem: corrigir `my-site` → criar `my-site-api` → `db:push:env` → nginx proxy).

## 2. Schema no banco novo (db:push)

O banco não é acessível publicamente. Caminho mais simples — Terminal do Coolify no
container da app `my-site-api` (a `DATABASE_URL` já está no ambiente):

```sh
pnpm db:push:env
```

(ou `pnpm --filter @dupply/db exec drizzle-kit push` — usa `DATABASE_URL` já presente no ambiente do container)

Alternativa do Mac: túnel SSH até o container do Postgres
(`ssh -L 15432:<ip-do-container>:5432 root@179.197.224.144`, descobrindo o IP com
`docker inspect <container> | grep IPAddress`) e rodar
`DATABASE_URL=postgres://postgres:senha@localhost:15432/postgres pnpm --filter @dupply/db exec drizzle-kit push`.

## 3. Site estático (`my-site`) — ajustes

1. **Build Command:** trocar para `pnpm build:site`
   (builda `apps/web` **e** `apps/console` — o console é copiado para `apps/web/dist/console`).
2. **Nginx (custom config):** substituir pela config abaixo — adiciona o proxy da API e o
   fallback do console (o SPA fallback padrão mandaria `/console/*` para o `index.html` errado).
   Trocar `<API_CONTAINER>` pelo nome do container da `my-site-api` (ver em `docker ps` ou no
   painel do app).

Usar `resolver` + variável no `proxy_pass` (ver `deploy/nginx-my-site.conf`).
`proxy_pass` fixo com hostname Docker derruba o nginx no boot se a API estiver off.

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    resolver 127.0.0.11 valid=10s ipv6=off;

    location /api/ {
        set $api_upstream http://<API_CONTAINER>:3000;
        proxy_pass $api_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
    }

    location /console/ {
        try_files $uri $uri/ /console/index.html;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```


3. **Connect To Predefined Network:** ativado também no `my-site` (senão o nginx não resolve o
   nome do container da API).

Os redirects de host da Vercel (`projetos.`, `drive.`, `webmail.` → Zoho) saem do `vercel.json`
e passam a ser regras de DNS/redirect no Cloudflare quando o DNS migrar.

## 4. Cron (retry da fila do Sheets)

Na Vercel havia um cron diário 09:00 chamando `/api/cron/retry-sheets`. No Coolify:
app `my-site-api` → **Scheduled Tasks** → novo task:

- Schedule: `0 9 * * *`
- Command: `curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/retry-sheets`

## 5. Checklist de validação do my-site completo

- [ ] `GET /api/health` responde `{"ok":true}` via domínio do site (prova que o proxy funciona)
- [ ] Diagnóstico completo no site salva relatório (`dbPending: false` na resposta)
- [ ] `/console` abre e loga com `CONSOLE_SECRET`
- [ ] Backup do Postgres agendado (aba Backups do `db-diagnostico` — local, depois S3)

## 6. Bloco DNS (antes de cancelar a Vercel — e-mail depende disso)

1. Inventário completo no painel da Vercel (Domains → dupply.com.br): todos os registros A,
   CNAME, MX, TXT (SPF/DKIM), subdomínios (dash, imob, email, projetos, drive, webmail…).
2. Criar conta gratuita no Cloudflare → adicionar dupply.com.br → replicar todos os registros
   (TTL baixo, 60–300s). E-mail é Zoho: conferir MX + TXT com atenção.
3. Registro.br: trocar nameservers de `ns1/ns2.vercel-dns.com` para os do Cloudflare.
4. Apontar `dupply.com.br` (e `www`) para `179.197.224.144`; configurar o FQDN no app
   `my-site` do Coolify (Traefik emite Let's Encrypt automaticamente).
5. Subdomínio para a API não é necessário (proxy same-origin), mas `api.dupply.com.br`
   pode ser criado depois se outro produto precisar.
6. Só depois de tudo validado: cancelar a assinatura da Vercel.

## Pendências anotadas

- Rotacionar `UPSTASH_REDIS_REST_TOKEN` e `RESEND_API_KEY` — apareceram em screenshots
  durante a migração.
- Migrar os demais produtos (dash, imob, atendimento) no mesmo padrão.
