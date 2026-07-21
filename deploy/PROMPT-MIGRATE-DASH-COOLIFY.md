# Prompt — Migrar Dash (e padrão SaaS) para Coolify VPS

> Cole este prompt no Claude Code **no repositório da Dash** (não no `my-site`).  
> Use como instrução de arquitetura e runbook; adapte caminhos/comandos ao monorepo real da dash após inventariar o código.

---

## Contexto (leia antes de qualquer mudança)

A Dupply **saiu da Vercel e do Neon** para o site institucional. O padrão definitivo é:

| Antes | Agora |
| --- | --- |
| Vercel (front + serverless) | Coolify no VPS (`179.197.224.144`) |
| Neon / Postgres gerenciado na nuvem | **PostgreSQL 16 dentro do VPS** (recurso Coolify Database) |
| DNS na Vercel | **Cloudflare** (NS: `chuck` / `rita.ns.cloudflare.com`) |
| Funções misturadas no mesmo deploy | **Front e API separados** (dois apps Docker no Coolify) |

### O que já está em produção no Coolify (referência obrigatória)

Projeto **Dupply** / environment **production**:

| Recurso | Papel | Domínio público |
| --- | --- | --- |
| `my-site` | SPA estático (nginx) | `https://dupply.com.br` (+ www) |
| `my-site-api` | Node/Express porta 3000 | **sem domínio próprio** — proxy `/api/` no nginx |
| `db-diagnostico` | Postgres 16 | só rede Docker interna |
| Coolify UI | painel | `https://vps.dupply.com.br` |

**Lição aprendida (não repetir erros):**

1. Apps Coolify **não** têm DNS estável pelo UUID do container. Só databases têm. Use **Custom Network Aliases** (ex.: `api-dash`) e aponte o nginx para o alias.
2. Em nginx, **nunca** use `proxy_pass http://hostname:port;` literal. Use:
   ```nginx
   resolver 127.0.0.11 valid=10s ipv6=off;
   set $api_upstream http://api-dash:PORTA;
   proxy_pass $api_upstream;
   ```
   Sem variável → crash loop do nginx.
3. Ative **Connect To Predefined Network** no front **e** na API (rede `coolify`), senão o alias não resolve.
4. `DATABASE_URL` = **Postgres URL (internal)** do Coolify (host = nome/container interno), nunca URL pública do Neon.
5. Variáveis `VITE_*` / build-time precisam estar marcadas como **Available at Buildtime**.
6. Traefik/proxy do Coolify precisa estar **running** para HTTPS.
7. Na Cloudflare, para Let's Encrypt na VPS: DNS do host que o Traefik serve deve estar **DNS only (nuvem cinza)** até o certificado emitir; depois pode proxiar se quiser.

### Escopo desta migração

1. **Agora:** migrar a **Dash** (`dash.dupply.com.br`).
2. **Depois:** migrar o **Imob** com o **mesmo padrão** (não inventar outro).
3. **Não** cancelar Vercel/Neon da dash até cutover validado (DNS + HTTPS + login + writes no Postgres novo).
4. E-mail continua na **Zoho** (MX já na Cloudflare). Não mexer em MX/SPF/DKIM Zoho sem necessidade.
5. Site `dupply.com.br` / `my-site` **não** faz parte desta tarefa — não alterar.

---

## Princípio de arquitetura (padrão SaaS Dupply daqui pra frente)

Todo produto SaaS no Coolify deve nascer/migrar assim:

```
┌─────────────────────────────┐
│  Cloudflare DNS             │
│  dash.dupply.com.br → VPS   │
└──────────────┬──────────────┘
               │ HTTPS (Traefik/Coolify)
               ▼
┌─────────────────────────────┐
│  app-dash  (static/nginx)   │  FQDN: https://dash.dupply.com.br
│  - UI (Vite/Next/etc.)      │
│  - proxy /api/ → api-dash   │
└──────────────┬──────────────┘
               │ rede Docker (alias)
               ▼
┌─────────────────────────────┐
│  api-dash  (Node/API)       │  SEM FQDN público (preferencial)
│  - auth, business logic     │  alias: api-dash
│  - DATABASE_URL interna     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  db-dash  (Postgres 16)     │  sem porta pública
└─────────────────────────────┘
```

**Regras:**

- Separar **sempre** `app-*` (front) e `api-*` (back). Não voltar a “tudo em um serverless”.
- Front fala com API via **mesma origem** (`/api/...`) + proxy nginx — evita CORS.
- Banco **só** na rede interna. Sem expor 5432 na internet.
- Um Postgres **por produto** (ou schema/tenant isolado se houver decisão explícita). Para a dash: criar `db-dash` dedicado (não reutilizar `db-diagnostico` do site).
- Secrets só no Coolify (env), não commitados. Remover `VERCEL_*`, `NEON_*`, connection strings antigas do Neon após cutover.

---

## Sua missão (Claude Code)

1. Inventariar o repositório da Dash: framework (Next/Vite), onde está a API, ORM (Prisma/Drizzle), auth, filas, storage, crons, env vars atuais (Vercel + Neon).
2. Propor e implementar a divisão **`app-dash` + `api-dash`** se ainda não existir (monorepo ou dois packages). Preferir monorepo pnpm se já for o caso.
3. Substituir Neon por Postgres Coolify (`db-dash`): migrations, `DATABASE_URL`, seed se houver.
4. Documentar e executar o runbook Coolify + DNS Cloudflare para `dash.dupply.com.br`.
5. Plano de cutover com rollback (voltar CNAME para Vercel se falhar).
6. Checklist de aceite. Só então marcar Vercel/Neon da dash como desligáveis.
7. Ao final, escrever `deploy/COOLIFY-DASH.md` (ou equivalente no repo da dash) espelhando o padrão do `my-site`.

**Não** migrar Imob nesta PR — apenas deixar o padrão documentado para reutilizar.

---

## Passo a passo — Coolify

### A) Banco `db-dash`

1. Coolify → projeto Dupply → production → **+ New** → Database → **PostgreSQL 16**.
2. Nome: `db-dash`.
3. **Não** expor porta publicamente.
4. Anotar:
   - Postgres URL **(internal)** → vai em `DATABASE_URL` da `api-dash`
   - user/password/db name
5. Ativar **Backups** (local; S3 depois).
6. Schema: rodar migrations a partir do container da `api-dash` (ex.: `pnpm db:migrate` / `drizzle-kit push` / `prisma migrate deploy`) com a `DATABASE_URL` interna já injetada.

**Migração de dados do Neon (se houver produção):**

1. Dump no Neon: `pg_dump` (custom ou plain).
2. Restore no `db-dash` via terminal Coolify / túnel SSH (mesmo padrão usado no my-site: não abrir Postgres na internet).
3. Validar contagens de tabelas críticas + um login de usuário real de teste.
4. Manter Neon em read-only / snapshot até 48–72h após cutover.

### B) App `api-dash`

1. Resource: Private Repository (GitHub App) → repo da dash → branch de produção.
2. Build Pack: Nixpacks (**não** static).
3. Base directory / install / build / start: conforme inventário (ex. `pnpm install`, `pnpm build:api`, `pnpm start:api`).
4. Port: a que o processo escuta (ex. `3000` ou `4000`) — documentar.
5. Advanced:
   - **Connect To Predefined Network:** ON
   - **Custom Network Aliases:** `api-dash`
6. FQDN: **deixar vazio** ou só sslip temporário de debug. Produção acessa via proxy do `app-dash`.
7. Envs (exemplos — ajustar ao inventário real):

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=<Postgres URL internal do db-dash>
# Auth (Clerk/Auth0/etc. — o que a dash usa hoje)
# Storage (S3/R2/Blob — se Vercel Blob, migrar para S3/R2/MinIO no VPS ou manter R2)
# Redis: preferir Upstash REST se já usado, OU Redis Coolify se for mudar
# Crons: Scheduled Tasks no Coolify batendo localhost
# Remover: VERCEL_*, NEON_*, DATABASE_URL antiga do Neon
```

8. Healthcheck: endpoint tipo `GET /api/health` ou `/health` retornando 200.

### C) App `app-dash` (front)

1. Resource separado no mesmo projeto/ambiente.
2. Static site (nginx) **ou** Node se for SSR (Next).  
   - Se SPA Vite: mesmo padrão do `my-site` (static + publish dir).  
   - Se Next SSR: app Node próprio; ainda assim manter API em `api-dash` se a lógica de negócio estiver separada.
3. FQDN: `https://dash.dupply.com.br` (e `www` só se existir — hoje o produto é `dash.`).
4. Connect To Predefined Network: ON.
5. Nginx custom (SPA) — espelho do my-site, trocando alias:

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    resolver 127.0.0.11 valid=10s ipv6=off;

    location /api/ {
        set $api_upstream http://api-dash:3000;  # ajustar porta
        proxy_pass $api_upstream;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90s;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

6. Build-time: `VITE_APP_URL=https://dash.dupply.com.br` (ou equivalente Next `NEXT_PUBLIC_*`). API base = relativo `/api` (não hardcodar sslip/IP).
7. Redeploy após qualquer mudança de env de build.

### D) Crons / filas / webhooks

- Crons Vercel → Coolify **Scheduled Tasks** na `api-dash` (`curl` para `localhost`).
- Webhooks externos (Stripe, WhatsApp, etc.): apontar para `https://dash.dupply.com.br/api/...` após DNS (mesma origem).
- Atualizar allowlists de domínio nos provedores (auth callback URLs, OAuth redirect, CORS se ainda houver).

---

## Passo a passo — DNS Cloudflare (`dash.dupply.com.br`)

### Estado atual provável

- `dash` ainda como **CNAME → `cname.vercel-dns.com`** (nuvem cinza).

### Cutover (ordem segura)

1. **Antes de mudar DNS:** `app-dash` + `api-dash` + `db-dash` verdes no Coolify; health OK via sslip ou URL temporária; teste de login + escrita no Postgres novo.
2. No Coolify `app-dash`, FQDN já salvo como `https://dash.dupply.com.br` (Traefik labels/Let’s Encrypt prontos).
3. Cloudflare → DNS → editar `dash`:
   - Tipo: **A**
   - Nome: `dash`
   - Conteúdo: `179.197.224.144`
   - Proxy: **DNS only (cinza)** até HTTPS validar
   - TTL: baixo (Auto/60–300)
4. Remover o CNAME antigo para Vercel **no mesmo passo** (não deixar CNAME + A conflitantes).
5. Validar:
   ```bash
   dig +short A dash.dupply.com.br   # → 179.197.224.144
   curl -I https://dash.dupply.com.br
   curl -s https://dash.dupply.com.br/api/health
   ```
6. Após cert OK, opcional: ligar proxy Cloudflare (laranja). Se quebrar WebSocket/uploads, manter cinza.
7. Na Vercel: remover domínio `dash.dupply.com.br` do projeto **só depois** do checklist de aceite.
8. Rollback se necessário: recriar CNAME `dash` → `cname.vercel-dns.com` e reanexar domínio na Vercel.

### O que **não** fazer no DNS da dash

- Não apontar `api.dash...` a menos que haja requisito explícito (preferimos proxy `/api`).
- Não alterar MX / Zoho / `webmail` / apex do site.
- Não apontar `imob` ainda — fica na Vercel até a migração seguinte.

---

## Integrações — checklist de inventário (preencher no repo da dash)

Para cada item: onde está hoje → para onde vai no Coolify.

| Integração | Hoje (Vercel/Neon/…) | Ação na migração |
| --- | --- | --- |
| Postgres | Neon `DATABASE_URL` | `db-dash` internal URL |
| Auth | ? | Atualizar URLs de callback para `https://dash.dupply.com.br` |
| E-mail transacional | Resend/outro | Manter provider; domain já no DNS Cloudflare |
| Storage / uploads | Vercel Blob / S3 / … | Definir destino (R2/S3/MinIO); migrar objects se preciso |
| Redis / rate limit | Upstash / … | Manter Upstash **ou** Redis Coolify |
| Payments | Stripe / … | Webhook URL → `https://dash.dupply.com.br/api/...` |
| Analytics | … | Atualizar domínio se necessário |
| Crons | `vercel.json` crons | Scheduled Tasks Coolify |
| Feature flags / Sentry | … | Novas env vars na `api-dash` / `app-dash` |

Remover dependências de runtime da Vercel (`@vercel/node` só se ainda bundlar handlers — preferir Express/Fastify/Hono puro como no `my-site-api`).

---

## Ordem de trabalho sugerida

1. Inventário + diagrama do repo atual  
2. Extrair/criar `api-dash` + `app-dash` no código  
3. Criar `db-dash` + migrations (+ dump/restore se prod)  
4. Deploy Coolify (API → DB → Front + nginx proxy)  
5. Testes em URL temporária/sslip  
6. Cutover DNS `dash`  
7. Checklist aceite + monitoramento 24–48h  
8. Desligar domínio na Vercel e Neon da dash  
9. Documentar; só então planejar **Imob** com o mesmo template (`app-imob` / `api-imob` / `db-imob`)

---

## Checklist de aceite (Dash)

- [ ] `https://dash.dupply.com.br` abre (HTTPS válido)
- [ ] `GET https://dash.dupply.com.br/api/health` → 200
- [ ] Login funciona (cookies/JWT/sessão)
- [ ] Create/update no banco grava no `db-dash` (não no Neon)
- [ ] Uploads / webhooks críticos OK
- [ ] Crons executam no Coolify
- [ ] Sem erros de CORS (mesma origem)
- [ ] Backup Postgres agendado
- [ ] Rollback DNS documentado e testável
- [ ] Doc `deploy/COOLIFY-DASH.md` no repo da dash

---

## Referências no ecossistema Dupply

- Site já migrado: repo `dupply-rp/my-site` → pastas `deploy/coolify.md`, `deploy/COOLIFY-PASSOS.md`, `deploy/nginx-my-site.conf`, `deploy/DNS-CLOUDFLARE.md`
- Coolify: `https://vps.dupply.com.br` (legado: `http://179.197.224.144:8000`)
- VPS IP: `179.197.224.144`

---

## Resposta esperada do agente

1. Inventário do repo (stack, envs, Neon, Vercel features).  
2. Plano de split front/API com estrutura de pastas.  
3. Diffs de código necessários.  
4. Runbook Coolify + DNS (comandos e telas).  
5. Script/checklist de migração de dados Neon → `db-dash`.  
6. Riscos e rollback.  
7. O que fica explícito para a futura migração do Imob (mesmo padrão, sem reimplementar).

Trabalhe de forma incremental, confirme decisões ambíguas (ex.: Next SSR vs SPA) antes de refatorar em massa, e **não** apague Neon/Vercel até o checklist de aceite estar verde.
