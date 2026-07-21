# Inventário DNS — dupply.com.br → Cloudflare + Coolify

Snapshot coletado em 2026-07-20 (nameservers ainda na Vercel).

## Estado atual (antes da migração)

| Tipo | Nome | Valor |
| --- | --- | --- |
| NS | `@` | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` |
| A | `@` | `216.150.1.193`, `216.150.1.129` (Vercel) |
| A | `www` | Vercel anycast |
| A | `dash`, `imob`, `email`, `projetos`, `drive`, `webmail`, `vps`, `atendimento`, `mail` | Vercel anycast (mesmo DNS da Vercel) |
| MX | `@` | `10 mx.zoho.com`, `20 mx2.zoho.com`, `30 mx3.zoho.com` |
| TXT | `@` | `v=spf1 include:zohomail.com ~all` |
| TXT | `@` | `zoho-verification=zb07564230.zmverify.zoho.com` |
| TXT | `@` | `resend-domain-verification=fe0736262b7e1afc0e784e40fa06072c` |
| TXT | `resend._domainkey` | DKIM Resend (chave pública presente) |

**Redirects hoje na Vercel** (`vercel.json` host-based):

| Host | Destino |
| --- | --- |
| `projetos.dupply.com.br` | `https://sprints.zoho.com/workspace/dupply#projects` |
| `drive.dupply.com.br` | Zoho WorkDrive (URL longa no `vercel.json`) |
| `webmail.dupply.com.br` | Zoho Mail sign-in |

Projeto Vercel `dupply` também lista: `dupply.com.br`, `www`, `drive`, `webmail`, `projetos`.

## Zona alvo na Cloudflare (TTL 60–300)

Proxy Cloudflare: **DNS only (nuvem cinza)** no apex/`www`/`vps` até o Let's Encrypt emitir; depois pode ligar proxy se quiser.

### Apontar para o Coolify VPS agora

| Tipo | Nome | Conteúdo | Proxy |
| --- | --- | --- | --- |
| A | `@` | `179.197.224.144` | DNS only |
| A | `www` | `179.197.224.144` | DNS only |
| A | `vps` | `179.197.224.144` | DNS only |

### Manter produtos na Vercel (até migrar cada app)

Na Vercel, cada subdomínio de produto precisa estar no projeto certo. Na Cloudflare use CNAME (não copie os IPs anycast da Vercel — mudam):

| Tipo | Nome | Conteúdo | Proxy |
| --- | --- | --- | --- |
| CNAME | `dash` | `cname.vercel-dns.com` | DNS only |
| CNAME | `imob` | `cname.vercel-dns.com` | DNS only |
| CNAME | `email` | `cname.vercel-dns.com` | DNS only |
| CNAME | `atendimento` | `cname.vercel-dns.com` | DNS only |
| CNAME | `mail` | `cname.vercel-dns.com` | DNS only |

Confirme no painel Vercel → Domains que cada host ainda está anexado ao projeto antes de trocar NS.

### Redirects Zoho (sair da Vercel → Cloudflare Redirect Rules)

Crie **Redirect Rules** (ou Page Rules) 301:

| De | Para |
| --- | --- |
| `https://projetos.dupply.com.br/*` | `https://sprints.zoho.com/workspace/dupply#projects` |
| `https://drive.dupply.com.br/*` | URL WorkDrive do `vercel.json` |
| `https://webmail.dupply.com.br/*` | URL Zoho Mail do `vercel.json` |

Registros DNS desses hosts: A `179.197.224.144` (proxied laranja **ou** DNS only + regra no Coolify Traefik). Mais simples: **proxied** + Redirect Rule na Cloudflare (não precisa app no Coolify).

### E-mail Zoho + Resend (copiar iguais)

| Tipo | Nome | Conteúdo |
| --- | --- | --- |
| MX | `@` | `10 mx.zoho.com` |
| MX | `@` | `20 mx2.zoho.com` |
| MX | `@` | `30 mx3.zoho.com` |
| TXT | `@` | `v=spf1 include:zohomail.com ~all` |
| TXT | `@` | `zoho-verification=zb07564230.zmverify.zoho.com` |
| TXT | `@` | `resend-domain-verification=fe0736262b7e1afc0e784e40fa06072c` |
| TXT | `resend._domainkey` | (colar o valor atual do TXT — copiar do Vercel Domains ou `dig`) |

Se o Zoho pedir DKIM (`zmail._domainkey` / `zoho._domainkey`), copie do painel Zoho — no snapshot público esses hosts não resolviam.

## Registro.br

1. Cloudflare → Add site `dupply.com.br` → criar zona com a tabela acima.
2. Anotar nameservers Cloudflare (`*.ns.cloudflare.com`).
3. Registro.br → Domínio → DNS → Nameservers → trocar de `ns1/ns2.vercel-dns.com` para os da Cloudflare.
4. Validar: `dig NS dupply.com.br` e `dig A dupply.com.br` → `179.197.224.144`.

## Coolify (apps)

| Host | App / recurso | FQDN |
| --- | --- | --- |
| `dupply.com.br`, `www` | `my-site` | `https://dupply.com.br,https://www.dupply.com.br` (**já setado**) |
| sslip (fallback teste) | `my-site` | `http://ngn9c6vejev9d2rrhto7gy0x.179.197.224.144.sslip.io` |
| `vps.dupply.com.br` | Instance Domain (painel) | `https://vps.dupply.com.br` |
| `/api/*` | proxy nginx → `my-site-api` | sem subdomínio público |

`VITE_SITE_URL=https://dupply.com.br` (buildtime) já está na app `my-site`.

## Coolify UI — `vps.dupply.com.br`

A API pública do Coolify **não** expõe Instance Domain (só pelo painel).

1. DNS: A `vps` → `179.197.224.144` (DNS only até emitir cert).
2. No Coolify: **Settings** (engrenagem) → **Configuration** / Instance Domain →
   `https://vps.dupply.com.br` → Save.
3. Se aparecer “Validating DNS failed” antes da propagação: Settings → Advanced → desligar DNS validation temporariamente, salvar, e religar depois.
4. Servers → Proxy: confirmar Traefik **running** (restart se status `exited`).
5. Acesso legado: `http://179.197.224.144:8000` até o HTTPS do `vps` funcionar.

**Não** cancele a Vercel nesta etapa.

## Checklist pós-propagação

- [ ] `dig +short dupply.com.br` → `179.197.224.144`
- [ ] `curl -I https://dupply.com.br` → 200 + certificado válido
- [ ] `curl -s https://dupply.com.br/api/health` → `{"ok":true,...}`
- [ ] `https://vps.dupply.com.br` abre o painel Coolify
- [ ] E-mail Zoho (enviar/receber teste)
- [ ] `dash` / `imob` ainda abrem na Vercel

### Validação agent (2026-07-20, **antes** da troca de NS)

| Check | Resultado |
| --- | --- |
| NS | ainda `ns1/ns2.vercel-dns.com` |
| A apex / vps | ainda IPs Vercel (não Coolify) |
| sslip `/api/health` | **200** `{"ok":true,"service":"dupply-diagnostico"}` |
| `https://dupply.com.br/api/health` | ainda Vercel (307→www) |
| `http://179.197.224.144:8000` | Coolify UI OK (302→login) |
| Coolify `my-site` FQDN | `https://dupply.com.br` + `www` + sslip (labels Traefik/LE prontos) |

HTTPS em `dupply.com.br` / `vps.dupply.com.br` só passa depois dos passos Cloudflare + Registro.br + Instance Domain no painel.
