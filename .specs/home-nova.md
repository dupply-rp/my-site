# Spec — Home nova do site institucional

Estado: pronta
Projeto: my-site
Branch: <preenchida pelo Davi>
Pedido por: Ricardo, nesta conversa, 17/09/2026 ("gostei, vamos iniciar")

**Estado pronta desde 18/09/2026.** O gate `especificacao` foi passado pelo Oscar depois de `ciad.yaml` e CI entrarem no PR #100 e a referência de arquivo em T5-T7 ser corrigida (ver "Parecer de validação" e o Histórico). Os três arquivos (`ciad.yaml`, `ci.yml` e esta spec) seguem no mesmo PR #100, sem merge ainda. Mesclar é publicar.

---

## 1. Problema de negócio

O site institucional é o destino de todo conteúdo do `@ricardo.lima.ia` e do `@dupplybr`, e hoje ele trabalha contra a venda. Evidência levantada em 17/09, olhando a página no ar e o código:

- **Faz uma afirmação que a Dupply não pode sustentar.** Nove logos de empresas grandes (Itaú, Santander, Neon, Toro, Pravaler, Claro, Grupo Boticário, RD Station, TOTVS) aparecem em grade de caixas brancas, que é o formato universal de mural de clientes. O dono confirmou em 17/09 que são a trajetória dele, e nenhum é cliente da Dupply.
- **Mostra número de resultado inventado.** A foto do herói exibe um painel com "+245h/mês", "R$ 98.750,00" e "76%", que não vêm de cliente nenhum, numa página que dedica um bloco a dizer o que não promete.
- **Promete o que não entrega.** O menu tem "Soluções" e "Resultados", e nenhuma das duas existe como conteúdo. Os quatro sistemas que a empresa vende não aparecem em lugar nenhum.
- **Abre pedindo leitura, não decisão.** Cinco parágrafos de corpo antes do primeiro botão, e dois botões do mesmo peso.
- **Diz o número errado sobre o dono.** "Mais de 15 anos" (`TrajectorySection.tsx:19-20`), quando são 21.

## 2. Decisões

Todas tomadas pelo dono em 17/09, nesta conversa, e registradas em `CIAD/docs/site/2026-09-17-projeto-novo-site.md`. **A frase do primeiro quadro foi revista em 18/09, ver nota abaixo da tabela.**

| Decisão | Quem |
|---|---|
| Direção visual "Autoridade": a página abre no nome do Ricardo, com o retrato sangrando no primeiro quadro | Ricardo |
| Os nove logos são trajetória dele, com legenda explícita "Onde eu trabalhei e entreguei projetos antes da Dupply" | Ricardo |
| São 21 anos, não 15 | Ricardo |
| Entram Otto, Atende, Congregar e Imob. Agenda e Dash ficam fora | Ricardo |
| O Imob entra com rótulo "EM PILOTO", porque não tem cliente pagante nem homologação de e-mail, pagamento e domínio | Ricardo, com o motivo levantado pela CIAD |
| Uma ação só na página: fazer o diagnóstico. O WhatsApp fica como saída secundária | Projeto, método `escrever-pagina` |
| Identidade da casa: Outfit, paleta `#1C2628`, `#F2F3F5`, `#5E62C5`, `#0215FC` e o gradiente entre os dois azuis | Manual da marca |
| Dado de demonstração pode ser usado nas telas de produto | Ricardo |

**Nota de 18/09 — frase do primeiro quadro revista duas vezes.** A versão original, "Eu trouxe o padrão do banco para a sua empresa.", foi aprovada em 17/09 e reprovada pelo próprio dono em 18/09, por soar vaidosa. A primeira substituta, "O que falta na sua operação não é ferramenta. É método.", foi aprovada pelo Bento (copy) no parecer de 18/09, mas o dono apontou uma contradição real antes de fechar: a Dupply também vende ferramenta (Otto, Atende, Congregar, Imob), então a frase não pode soar como se desprezasse o que ela vende. **A frase final, aprovada pelo dono em 18/09, resolve isso mudando o alvo de "ferramenta" para "ferramenta sem método": "O que falta na sua operação não é mais uma ferramenta de IA. É método por trás dela."** Isso mantém a lógica do bloco 8 (Otto, Atende, Congregar, Imob) coerente: são ferramentas com o método já embutido, não a "mais uma ferramenta solta" que a frase ataca.

O desenho aprovado está em `https://claude.ai/artifact/CX3msAaGH4NRoADGk2okqV`, prancha "Home · direção Autoridade". **É o contrato visual desta spec**, com a frase do herói substituída pela versão final acima.

## 3. Contratos

Não há rota nova, payload novo, tabela nova nem mudança de schema. **Esta entrega é só de apresentação.**

### Arquivos que mudam

| Arquivo | O que acontece |
|---|---|
| `apps/web/src/styles/tokens.css` | Recebe a paleta e a tipografia da marca |
| `apps/web/src/styles/landing.css` | Reescrito para o desenho novo |
| `apps/web/src/components/layout/Header.tsx` | Menu novo, logo da marca, um botão só |
| `apps/web/src/components/layout/Footer.tsx` | Logo da marca, links revistos |
| `apps/web/src/components/sections/Hero.tsx` | Vira o herói de autoridade, com retrato |
| `apps/web/src/components/sections/TrajectorySection.tsx` | Vira a faixa de autoridade, só com a legenda e os logos |
| `apps/web/src/components/sections/DiagnosisSection.tsx` | Cada dor ganha a segunda linha com a saída |
| `apps/web/src/components/sections/ProcessSection.tsx` | Mesmo conteúdo, desenho novo |
| `apps/web/src/components/sections/FaqSection.tsx` | Ganha as quatro perguntas novas |
| `apps/web/src/components/sections/FinalCtaSection.tsx` | Fecho em gradiente |
| `apps/web/src/components/sections/BenefitsSection.tsx` | **Removido.** Os seis benefícios genéricos saem da home |
| `apps/web/src/components/sections/DiagnosticoBanner.tsx` | **Removido.** O convite ao diagnóstico já está no topo e no fecho |
| `apps/web/src/constants/content.ts` | Textos novos, e a correção de 15 para 21 anos |
| `apps/web/src/constants/faq.ts` | Perguntas novas |
| `apps/web/src/constants/links.ts` | Mensagem pré-preenchida de WhatsApp por origem |
| `apps/web/src/lib/analytics.ts` | Eventos novos |
| `apps/web/src/App.tsx` | Nenhuma mudança de conteúdo; permanece só com rotas e componentes globais (`AnalyticsTracker`, `ThemeToggle`, `WhatsappFloatingButton`) |
| `apps/web/src/pages/HomePage.tsx` | Ordem das seções |

### Arquivos novos

| Arquivo | O que é |
|---|---|
| `apps/web/src/components/sections/MetodoSection.tsx` | **novo.** Os quatro cards do método, com número, título e frase |
| `apps/web/src/components/sections/PromessasSection.tsx` | **novo.** "O que a Dupply não promete", que hoje vive dentro do `Hero.tsx` |
| `apps/web/src/components/sections/SolucoesSection.tsx` | **novo.** Os quatro produtos |
| `apps/web/src/assets/marca/` | **novo.** Logotipo e monograma, em SVG |

### Assets da marca

Vêm de `~/Library/Mobile Documents/com~apple~CloudDocs/dupply/Identidade Visual/LOGO/SVG/SVG`, e o dono precisa copiá-los para o repositório, porque estão no iCloud dele:

Os 31 arquivos da pasta foram lidos e classificados em 17/09 pela proporção do `viewBox`, pela presença de `<rect>` de fundo e pelas cores declaradas dentro de cada um. Os quatro que a entrega usa:

| Origem | Vira | O que é | Uso |
|---|---|---|---|
| `Prancheta 9.svg` | `assets/marca/dupply-assinatura-clara.svg` | Monograma com gradiente e a palavra em off white `#F2F3F5`, sem fundo | Topo e rodapé, sobre fundo escuro |
| `Prancheta 1.svg` | `assets/marca/dupply-assinatura-escura.svg` | Monograma com gradiente e a palavra em `#1C2628`, sem fundo | Sobre fundo claro |
| `Prancheta 1 cópia 5.svg` | `assets/marca/dupply-assinatura-mono.svg` | Tudo em `#1C2628`, sem gradiente | Uma cor só: impressão, favicon, fundo colorido |
| `Prancheta 1 cópia 3_1.svg`, **com o `<rect>` de fundo removido** | `assets/marca/dupply-monograma.svg` | O `dp` sozinho, caminho único | Marca d'água grande, com a cor definida por seção |

**O último exige o recorte, e não existe alternativa pronta.** Nenhum dos 31 arquivos tem o `dp` sem plaqueta: todos os quadrados trazem o gradiente ou uma cor chapada atrás. O `Prancheta 1 cópia 3_1.svg` é o mais simples de todos, um `<rect>` azul mais um único `<path>` com o desenho. Tirando o `<rect>`, sobra exatamente o `dp`, sem alterar o desenho.

Para quem for conferir: `Prancheta 1 cópia.svg` também serve para fundo escuro, e a única diferença para o `Prancheta 9.svg` é a palavra em branco puro em vez do off white da paleta. Por isso a escolha é o `Prancheta 9.svg`.

**Regra dura, e nasceu de erro real de hoje:** para marca d'água usa-se o monograma **sem** o quadrado de fundo. Usar o arquivo com o quadrado produz uma borda visível em qualquer opacidade baixa.

**Segunda regra, do mesmo erro:** os arquivos do manual têm margem em volta do desenho. Posicionar por altura sem conferir a área útil encolhe a logo quase pela metade.

### Contato: o que existe hoje e o que muda

**Conferido no repositório em 17/09.** O número está certo e é o mesmo que o dono pediu:

- `WHATSAPP_URL` em `links.ts` aponta para `wa.me/5577999518373`, que é o **(77) 99951-8373**;
- ele aparece como botão no herói, no rodapé, no fecho e no botão flutuante;
- **`WHATSAPP_PHONE = '(77) 99951-8373'` está declarado e nunca é usado.** O número não aparece escrito em lugar nenhum do site, só como link;
- **os quatro botões usam a mesma mensagem pronta:** *"Olá! Vim através do diagnóstico de IA da Dupply e gostaria de falar com um especialista."* Quem nunca fez o diagnóstico manda essa frase mesmo assim.

As mensagens por origem, que resolvem de graça o problema levantado pelo Caio (tráfego pago) de o mesmo número atender institucional, Congregar, Atende e suporte do Otto sem ninguém saber de onde veio quem chamou:

| Origem | Mensagem |
|---|---|
| Herói e botão flutuante | Olá! Vim pelo site da Dupply e quero entender como a IA entra na minha operação. |
| Fecho da home | Olá! Vim pelo site da Dupply e quero conversar sobre o meu caso. |
| Relatório do diagnóstico | Olá! Vim através do diagnóstico de IA da Dupply e gostaria de falar com um especialista. (a atual, mantida) |
| Cartão de cada produto | Olá! Vim pelo site e quero saber sobre o Dupply `<produto>`. |
| Link da bio do Instagram | Olá! Vim pelo Instagram do Ricardo. |
| Cliente pedindo suporte | Olá! Sou cliente da Dupply e preciso de suporte. |

**A última é a que mais vale.** Hoje lead novo e cliente com problema chegam no mesmo número com a mesma frase.

## 4. Configuração e ambiente

Nenhuma variável de ambiente nova. Nenhum segredo novo.

**Uma dependência nova:** a fonte Outfit. Entra pelo Google Fonts, gratuita, com `display=swap`, sem pacote npm. Custo zero.

**Nenhum custo recorrente novo.** Artigo VII atendido.

## 5. Critérios de aceite

1. Dado que alguém abre `dupply.com.br` num computador, quando a página carrega, então o primeiro quadro mostra o retrato do Ricardo sangrando à direita, o título "O que falta na sua operação não é mais uma ferramenta de IA. É método por trás dela." e **um único botão cheio**, "Fazer o diagnóstico gratuito".
2. Dado que alguém abre a home, quando procura o botão do WhatsApp, então ele existe com peso visual menor que o do diagnóstico, no herói e no fecho.
3. Dado que alguém lê a faixa de autoridade, quando vê os nove logos, então acima deles está escrito "Onde eu trabalhei e entreguei projetos antes da Dupply", e eles aparecem em linha corrida, nunca em grade de caixas.
4. Dado que alguém procura quantos anos de experiência, quando lê a página inteira, então o número é 21 em todo lugar, e "15" não aparece.
5. Dado que alguém chega no bloco do método, quando lê os quatro cards, então cada um tem número, título curto e uma frase, e o bloco fecha com "Processo de banco, rodando numa empresa pequena."
6. Dado que alguém chega no bloco de soluções, quando lê, então aparecem Otto, Atende, Congregar e Imob, o Imob com o rótulo "EM PILOTO", e Agenda e Dash não aparecem.
7. Dado que alguém abre a home num celular de 390 px, quando rola a página inteira, então não há rolagem horizontal, nenhum alvo de toque é menor que 44 px e nenhum título quebra no meio de palavra.
8. Dado que alguém clica em qualquer botão de diagnóstico ou de WhatsApp, quando o clique acontece, então um evento é disparado com o bloco de origem, e o evento aparece no relatório em tempo real do GA4.
9. Dado que alguém entra por um link com parâmetro de origem, quando a página carrega, então a origem é registrada e o link de WhatsApp daquela página leva a mensagem pré-preenchida correspondente.
10. Dado que a página é medida com Lighthouse em celular, quando o teste roda, então o Largest Contentful Paint fica abaixo de 2,5 segundos.
11. Nenhuma imagem da página exibe número de resultado que não venha de cliente real. A imagem `ricardo-lima3.png` sai da home.
17. Dado que alguém procura o contato da Dupply, quando chega no rodapé, então o número **(77) 99951-8373** está escrito por extenso, e clicável, além de existir como botão no herói e no fecho.
18. Dado que alguém clica no WhatsApp a partir de lugares diferentes, quando a conversa abre, então a mensagem pré-preenchida é a daquela origem, e não a mesma em todos.
19. Dado que alguém chega no bloco do método, quando lê o fecho do bloco, então **não existe nenhum botão ou link do tipo "Ver como funciona na prática"** nesta entrega: a demonstração interativa do método é item de fora de escopo (seção 6), e este bloco fecha só com a frase "Processo de banco, rodando numa empresa pequena.", sem call-to-action próprio.
20. Dado que alguém lê qualquer resposta do FAQ sobre proteção de dado do cliente, quando lê o texto, então a resposta afirma a regra ("dado de cliente não vira treino de modelo, e é conferido") sem citar o nome de nenhum artefato de governança interna da CIAD (não aparecem as palavras "constituição", "CIAD" nem "Hermes" no texto voltado ao público).

### Não pode quebrar

12. `dupply.com.br/diagnostico` continua abrindo, o questionário continua enviando e o relatório continua chegando por e-mail.
13. `/privacidade`, `/termos` e `/exclusao-de-dados` continuam abrindo com o conteúdo atual.
14. `/console` continua abrindo.
15. O Google Analytics 4 existente (`G-GGEM21VHJW`) continua carregando, com o mesmo consentimento de cookie de hoje.
16. Os dados estruturados de `JsonLd.tsx` continuam presentes e válidos.

## 6. Fora de escopo

- **O bloco "Para quem a Dupply não é".** Depende de três linhas que só o dono escreve.
- **O bloco de preço.** Depende da decisão dele de publicar faixa ou não.
- **A demonstração interativa "Ver como funciona na prática".** Apareceu num mockup fora do fluxo da CIAD, sem spec própria e sem decisão de para onde aponta (vídeo, demo ao vivo, outra página). Não entra nesta onda. Se o dono quiser esse botão, é spec nova, com o destino definido antes de qualquer código.
- **Capturas reais de produto.** Dependem de um workspace de demonstração em cada sistema, que é entrega própria. Nesta onda o herói usa o retrato, não a tela do produto.
- **O hub `/ricardo`** e as páginas por produto. Specs próprias.
- **O redesenho do `/diagnostico`.** Ele herda os tokens novos, e o resto fica para depois.
- **Qualquer mudança de dependência** além da fonte, porque exige regenerar o `pnpm-lock.yaml`, o que não cabe no fluxo pelo GitHub.
- **O cron que reprocessa lead do diagnóstico.** O dono confirmou em 17/09 que a Dupply não está mais na Vercel, e o cron diário que existe no `vercel.json` era de lá. Não há equivalente na pasta `deploy/`. Recriar esse job no Coolify é entrega própria, e urgente, porque lead que falhou no envio para a planilha não está sendo reprocessado desde a mudança de hospedagem.

## 7. Tarefas

- [ ] **T1. Tokens da marca** (critérios 1 a 7)
  - Paleta, tipografia Outfit, escala de espaço e raios em `tokens.css`
  - testes: o build passa e nenhuma página existente perde estilo
- [ ] **T2. Assets da marca** (critérios 1, 3)
  - Copiar os três SVG para `assets/marca/`, com o monograma sem o `<rect>`
  - testes: os três arquivos carregam, e o monograma não tem retângulo de fundo
- [ ] **T3. Topo e rodapé** (critérios 1, 2)
  - `Header.tsx` e `Footer.tsx` com a assinatura da marca e um botão só
  - testes: a logo tem altura de 50 px no topo e a área útil ocupa a altura declarada
- [ ] **T4. Herói e faixa de autoridade** (critérios 1, 2, 3, 4, 11)
  - `Hero.tsx` e `TrajectorySection.tsx`, com o retrato, a legenda e os logos em linha, usando o título final da seção 2 ("O que falta na sua operação não é mais uma ferramenta de IA. É método por trás dela.")
  - testes: a palavra "15" não aparece no HTML da home, `ricardo-lima3.png` não é referenciada, e o texto "Eu trouxe o padrão do banco" também não aparece em lugar nenhum
- [ ] **T5. Método** (critérios 5, 19)
  - `MetodoSection.tsx` novo, quatro cards com número, título e frase, mais a faixa de fecho, **sem nenhum botão ou link ao final do bloco**
  - testes: os quatro títulos aparecem, a frase de fecho também, e não existe elemento clicável do tipo "ver como funciona"
- [ ] **T6. Problema, processo e promessas** (critérios 1, 7)
  - `DiagnosisSection.tsx` com a segunda linha por dor, `ProcessSection.tsx` redesenhada, `PromessasSection.tsx` nova a partir do que hoje está dentro do `Hero.tsx`
  - testes: os seis itens de "o que não prometemos" continuam na página
- [ ] **T7. Soluções, dúvidas e fecho** (critérios 6, 2, 20)
  - `SolucoesSection.tsx` nova, `FaqSection.tsx` com as perguntas novas **e a resposta sobre dado de cliente sem citar artefato de governança interna**, `FinalCtaSection.tsx` em gradiente. Remover `BenefitsSection.tsx` e `DiagnosticoBanner.tsx` do `HomePage.tsx`
  - testes: os quatro produtos aparecem, "Agenda" e "Dash" não aparecem, o Imob tem o rótulo, e nenhuma resposta do FAQ contém as palavras "constituição", "CIAD" ou "Hermes"
- [ ] **T8. Contato e medição** (critérios 8, 9, 10, 17, 18)
  - Eventos em `analytics.ts`, origem por parâmetro, mensagem de WhatsApp por origem em `links.ts`
  - O número escrito por extenso no rodapé, usando a constante `WHATSAPP_PHONE` que já existe e nunca foi usada
  - testes: cada botão dispara o evento com o bloco de origem certo, e cada link abre com a mensagem daquela origem

**Arquivos que o Davi precisa ler:** `apps/web/src/pages/HomePage.tsx`, `apps/web/src/styles/tokens.css`, `apps/web/src/styles/landing.css`, `apps/web/src/constants/content.ts`, `apps/web/src/constants/links.ts`, `apps/web/src/lib/analytics.ts`, e a prancha aprovada.

**Como testar:** `pnpm lint` e `pnpm build:site`, conforme o `ciad.yaml`. Depois, no navegador: a home em 1440 px e em 390 px, o `/diagnostico` enviando de verdade, e o relatório em tempo real do GA4 recebendo os eventos.

### Perguntas abertas

Nenhuma. O que dependia do dono virou "Fora de escopo".

### Parecer de validação

Gate: especificacao
Decisão: PRONTA
Itens não atendidos: nenhum

Segunda passada, depois da correção de referência acima (`App.tsx` → `pages/HomePage.tsx`). Conferido de novo no repositório: `HomePage.tsx` existe com esse nome e monta as seções na ordem que a spec descreve. `App.tsx` de fato só tem rotas e componentes globais, então a tabela da seção 3 agora está exata. Nenhum outro item obrigatório do gate falha: problema de negócio com evidência concreta, nenhuma pergunta aberta, decisões técnicas registradas (frase final do herói com histórico de por que mudou duas vezes), critérios de aceite observáveis e verificáveis, "não pode quebrar" listado, fora de escopo explícito, oito tarefas na ordem certa de dependência (tokens e assets antes de seções que os usam), comandos de validação definidos no `ciad.yaml`. Spec cabe em uma leitura, sem exigir abrir a arquitetura inteira.
Avaliado por: Oscar em 2026-09-18

## 8. Registro de implementação

(Davi)

## 9. Revisão de qualidade

(Vera)

## 10. Publicação

(Rui)

## Histórico

| Data | Papel | Estado | O que aconteceu | Próxima ação |
|---|---|---|---|---|
| 17/09/2026 | Dora (especificação) | rascunho | Spec escrita a partir do projeto e da prancha aprovada pelo dono | Entrar com `ciad.yaml` e CI no `my-site`, e então validar com o Oscar |
| 18/09/2026 | Dora (especificação) | rascunho | Um mockup fora do fluxo da CIAD (feito por outro agente) implementou a spec ao pé da letra, inclusive a frase já reprovada pelo dono no critério 1, e trouxe dois elementos sem decisão: um botão "Ver como funciona na prática" no bloco de método, e uma resposta de FAQ citando "nossa constituição" para explicar a proteção de dado do cliente. A equipe (Iris, Bento, Gil, Clara, Manu, Téo, Caio) revisou o mockup e o projeto contra o site real e as referências. O dono reprovou a frase de novo, aprovou a primeira substituta do Bento e depois apontou uma contradição (a Dupply também vende ferramenta), fechando a frase final nesta conversa. Critérios 1 e T4 atualizados com a frase final; critério 19 e T5 fecham o botão sem destino como fora de escopo; critério 20 e T7 tiram a citação ao artefato de governança interna do texto público. | Confirmar `ciad.yaml` e CI no PR #100, então validar com o Oscar. |
| 18/09/2026 | Oscar (arquiteto) | volta a rascunho | `ciad.yaml` e CI confirmados no PR #100, CI verde. Conferência de referências no repositório achou um erro: a seção 3 e as tarefas T5-T7 citavam `App.tsx` como o arquivo que ordena as seções da home, mas quem faz isso é `pages/HomePage.tsx` (`App.tsx` só tem rotas e componentes globais). Corrigido na própria passada: seção 3, T7 e a lista de arquivos que o Davi precisa ler agora apontam para `HomePage.tsx`. Resto do gate de especificação passa: nenhuma pergunta aberta, critérios verificáveis, fora de escopo explícito, oito tarefas, ordem de dependência ok. | Nova passada de validação, só para confirmar a correção de referência; sem decisão nova do dono envolvida. |
