// packages/diagnostico/dist/questions.js
var questionSections = [
  {
    label: "\u{1F3E2} Perfil da Empresa",
    questions: [
      {
        id: "contato",
        type: "contact",
        text: "Vamos come\xE7ar com seus dados",
        hint: "Usamos essas informa\xE7\xF5es para personalizar seu relat\xF3rio e entrar em contato, se necess\xE1rio",
        fields: [
          {
            id: "nome",
            label: "Nome da empresa",
            placeholder: "Ex: Tech Solutions Ltda",
            inputType: "text",
            required: true
          },
          {
            id: "email",
            label: "E-mail",
            placeholder: "seu@empresa.com.br",
            inputType: "email",
            required: true
          },
          {
            id: "telefone",
            label: "Telefone / WhatsApp",
            placeholder: "(77) 99999-9999",
            inputType: "tel",
            required: true
          }
        ]
      },
      {
        id: "setor",
        type: "select",
        text: "Em qual setor sua empresa atua?",
        hint: "Selecione o que mais se aproxima",
        options: [
          "Varejo / E-commerce",
          "Ind\xFAstria / Manufatura",
          "Sa\xFAde / Medicina",
          "Educa\xE7\xE3o",
          "Alimenta\xE7\xE3o / Restaurante",
          "Financeiro / Contabilidade",
          "Imobili\xE1rio / Constru\xE7\xE3o",
          "Tecnologia / Software",
          "Log\xEDstica / Transporte",
          "Servi\xE7os Profissionais",
          "Agroneg\xF3cio",
          "Outro"
        ]
      },
      {
        id: "porte",
        type: "single",
        text: "Quantas pessoas trabalham na sua empresa?",
        hint: "Inclua colaboradores fixos e terceiros",
        options: [
          { e: "\u{1F464}", l: "S\xF3 eu (MEI/Solo)", d: "Neg\xF3cio individual" },
          { e: "\u{1F465}", l: "2 a 10 pessoas", d: "Micro empresa" },
          { e: "\u{1F3E2}", l: "11 a 50 pessoas", d: "Pequena empresa" },
          { e: "\u{1F3D9}\uFE0F", l: "51 a 200 pessoas", d: "M\xE9dia empresa" },
          { e: "\u{1F306}", l: "Mais de 200 pessoas", d: "Grande empresa" }
        ]
      },
      {
        id: "faturamento",
        type: "single",
        text: "Qual o faturamento mensal aproximado?",
        hint: "Faixa aproximada \u2014 n\xE3o precisa ser exato",
        options: [
          { e: "\u{1F331}", l: "At\xE9 R$ 50 mil", d: "Est\xE1gio inicial" },
          { e: "\u{1F4C8}", l: "R$ 50k a R$ 200k", d: "Em crescimento" },
          { e: "\u{1F4BC}", l: "R$ 200k a R$ 1M", d: "Consolidado" },
          { e: "\u{1F680}", l: "Acima de R$ 1M", d: "Escala avan\xE7ada" }
        ]
      }
    ]
  },
  {
    label: "\u2699\uFE0F Opera\xE7\xF5es & Processos",
    questions: [
      {
        id: "processos_manuais",
        type: "multi",
        text: "Quais tarefas sua equipe faz manualmente hoje?",
        hint: "Selecione todas que se aplicam",
        options: [
          { e: "\u{1F4CB}", l: "Lan\xE7amento de dados em planilhas", d: "Excel, Google Sheets etc." },
          { e: "\u{1F4E7}", l: "Resposta a e-mails repetitivos", d: "Perguntas frequentes, confirma\xE7\xF5es" },
          { e: "\u{1F4CA}", l: "Gera\xE7\xE3o de relat\xF3rios", d: "Coleta e compila\xE7\xE3o manual" },
          { e: "\u{1F4C6}", l: "Agendamento e confirma\xE7\xF5es", d: "Clientes, fornecedores, equipe" },
          { e: "\u{1F9FE}", l: "Emiss\xE3o de notas/cobran\xE7as", d: "NF, boletos, recibos" },
          { e: "\u{1F4E6}", l: "Controle de estoque", d: "Entrada, sa\xEDda, invent\xE1rio" },
          { e: "\u{1F504}", l: "Transfer\xEAncia de dados entre sistemas", d: "Copiar de um sistema para outro" },
          { e: "\u{1F4F1}", l: "Postagens e conte\xFAdo", d: "Redes sociais, e-mail marketing" }
        ]
      },
      {
        id: "tempo_desperdicado",
        type: "single",
        text: "Quanto tempo sua equipe perde por semana em tarefas repetitivas?",
        hint: "Estimativa geral de toda a equipe",
        options: [
          { e: "\u26A1", l: "Menos de 2 horas", d: "Processos bem otimizados" },
          { e: "\u{1F550}", l: "2 a 5 horas", d: "Alguma inefici\xEAncia" },
          { e: "\u{1F551}", l: "5 a 15 horas", d: "Perda significativa" },
          { e: "\u{1F552}", l: "Mais de 15 horas", d: "Urgente otimizar" }
        ]
      },
      {
        id: "sistemas",
        type: "multi",
        text: "Quais sistemas/ferramentas sua empresa usa?",
        hint: "Selecione todos que utilizam",
        options: [
          { e: "\u{1F4CA}", l: "ERP (SAP, TOTVS, Omie\u2026)", d: "Gest\xE3o empresarial integrada" },
          { e: "\u{1F465}", l: "CRM (Salesforce, RD Station\u2026)", d: "Gest\xE3o de clientes" },
          { e: "\u{1F4AC}", l: "WhatsApp Business", d: "Comunica\xE7\xE3o com clientes" },
          { e: "\u{1F4E7}", l: "E-mail marketing (RD, Mailchimp\u2026)", d: "Comunica\xE7\xE3o em massa" },
          { e: "\u{1F6D2}", l: "Loja virtual (Shopify, VTEX\u2026)", d: "E-commerce" },
          { e: "\u{1F4CB}", l: "Planilhas (Excel/Sheets)", d: "Controles manuais" },
          { e: "\u{1F4B0}", l: "Financeiro (ContaAzul, Nibo\u2026)", d: "Gest\xE3o financeira" },
          { e: "\u{1F5C2}\uFE0F", l: "Nenhum sistema espec\xEDfico", d: "Processos informais" }
        ]
      }
    ]
  },
  {
    label: "\u{1F465} Clientes & Vendas",
    questions: [
      {
        id: "atendimento",
        type: "single",
        text: "Como \xE9 o atendimento ao cliente hoje?",
        hint: "Canal principal de suporte",
        options: [
          { e: "\u{1F4DE}", l: "Telefone / WhatsApp manual", d: "Equipe responde individualmente" },
          { e: "\u{1F916}", l: "Chatbot b\xE1sico", d: "Automa\xE7\xE3o parcial" },
          { e: "\u{1F3AB}", l: "Sistema de tickets", d: "Help desk organizado" },
          { e: "\u{1F500}", l: "Misto / sem padr\xE3o", d: "Varia conforme a situa\xE7\xE3o" }
        ]
      }
    ]
  },
  {
    label: "\u{1F4CA} Dados & Decis\xF5es",
    questions: [
      {
        id: "decisoes",
        type: "single",
        text: "Como as decis\xF5es estrat\xE9gicas s\xE3o tomadas na empresa?",
        hint: "Seja honesto \u2014 n\xE3o existe resposta certa ou errada",
        options: [
          { e: "\u{1F3B2}", l: "Por intui\xE7\xE3o e experi\xEAncia", d: "Sem dados formais" },
          { e: "\u{1F4CB}", l: "Com base em relat\xF3rios manuais", d: "Planilhas e documentos" },
          { e: "\u{1F4CA}", l: "Com dashboards/BI b\xE1sico", d: "Alguma visualiza\xE7\xE3o de dados" },
          { e: "\u{1F9E0}", l: "Com an\xE1lise avan\xE7ada de dados", d: "Data-driven consistente" }
        ]
      },
      {
        id: "dados_disponiveis",
        type: "multi",
        text: "Quais dados sua empresa j\xE1 coleta ou tem acesso?",
        hint: "Selecione os dispon\xEDveis",
        options: [
          { e: "\u{1F4B0}", l: "Dados financeiros", d: "Receitas, custos, margem" },
          { e: "\u{1F465}", l: "Hist\xF3rico de clientes", d: "Compras, prefer\xEAncias" },
          { e: "\u{1F4E6}", l: "Dados de estoque/produ\xE7\xE3o", d: "Quantidades, giro" },
          { e: "\u{1F4F1}", l: "M\xE9tricas digitais", d: "Site, redes sociais, an\xFAncios" },
          { e: "\u{1F60A}", l: "Satisfa\xE7\xE3o do cliente", d: "NPS, avalia\xE7\xF5es" },
          { e: "\u{1F50D}", l: "Poucos ou nenhum dado", d: "Sem coleta estruturada" }
        ]
      },
      {
        id: "maior_dor",
        type: "single",
        text: "Qual \xE9 a sua maior dor operacional hoje?",
        hint: "O problema que mais te tira o sono",
        options: [
          { e: "\u23F1\uFE0F", l: "Falta de tempo \u2014 apagando inc\xEAndio", d: "Nunca sobra tempo estrat\xE9gico" },
          { e: "\u{1F4B8}", l: "Custo alto de opera\xE7\xE3o", d: "Equipe grande para o que entrega" },
          { e: "\u{1F4C9}", l: "Dificuldade para crescer", d: "Escalar sem perder qualidade" },
          { e: "\u{1F50D}", l: "Falta de visibilidade", d: "N\xE3o sei o que est\xE1 acontecendo" },
          { e: "\u{1F629}", l: "Equipe sobrecarregada", d: "Pessoas fazendo trabalho de m\xE1quina" },
          { e: "\u{1F422}", l: "Processos muito lentos", d: "Tudo demora mais do que deveria" }
        ]
      },
      {
        id: "contexto_negocio",
        type: "textarea",
        text: "Conte sobre o seu neg\xF3cio em suas pr\xF3prias palavras",
        hint: "Opcional, mas recomendado \u2014 descreva como a empresa funciona, os desafios e o que espera com IA",
        placeholder: "Ex: Somos uma cl\xEDnica com 3 unidades. Perdemos muito tempo confirmando consultas no WhatsApp, o CRM n\xE3o conversa com a agenda e a equipe repete as mesmas respostas o dia inteiro...",
        minLength: 40,
        maxLength: 2e3
      }
    ]
  },
  {
    label: "\u{1F916} Maturidade com IA",
    questions: [
      {
        id: "experiencia_ia",
        type: "single",
        text: "Qual \xE9 o n\xEDvel de experi\xEAncia da sua empresa com IA?",
        hint: "Seja honesto \u2014 isso ajuda a calibrar as recomenda\xE7\xF5es",
        options: [
          { e: "\u{1F331}", l: "Nunca usamos IA", d: "Interesse mas sem experi\xEAncia" },
          { e: "\u{1F50D}", l: "Estamos explorando", d: "Testando ferramentas, sem implanta\xE7\xE3o" },
          { e: "\u26A1", l: "Usamos em algumas \xE1reas", d: "J\xE1 automatizamos algo" },
          { e: "\u{1F680}", l: "IA faz parte do nosso DNA", d: "M\xFAltiplas aplica\xE7\xF5es em produ\xE7\xE3o" }
        ]
      },
      {
        id: "budget",
        type: "single",
        text: "Qual o investimento mensal que sua empresa poderia alocar para IA?",
        hint: "Considerando ferramentas + implementa\xE7\xE3o",
        options: [
          { e: "\u{1F331}", l: "At\xE9 R$ 500/m\xEAs", d: "Ferramentas b\xE1sicas" },
          { e: "\u{1F4C8}", l: "R$ 500 a R$ 2.000/m\xEAs", d: "Solu\xE7\xF5es intermedi\xE1rias" },
          { e: "\u{1F4BC}", l: "R$ 2.000 a R$ 10.000/m\xEAs", d: "Implementa\xE7\xE3o robusta" },
          { e: "\u{1F680}", l: "Acima de R$ 10.000/m\xEAs", d: "Transforma\xE7\xE3o digital completa" }
        ]
      }
    ]
  }
];
var allQuestions = questionSections.flatMap((section) => section.questions.map((question) => ({
  ...question,
  sectionLabel: section.label
})));
var TOTAL_QUESTIONS = allQuestions.length;

// packages/diagnostico/dist/buildSummary.js
var CONTEXT_MAX_CHARS = 800;
var SKIP_CONTACT_FIELDS = /* @__PURE__ */ new Set(["email", "telefone"]);
function buildSummary(answers, options = {}) {
  const mode = options.mode ?? "preview";
  const isApi = mode === "api";
  const lines = allQuestions.flatMap((question) => {
    if (isApi && question.id === "contexto_negocio")
      return [];
    if (question.type === "contact") {
      const fields = isApi ? question.fields.filter((field) => !SKIP_CONTACT_FIELDS.has(field.id)) : question.fields;
      return fields.map((field) => {
        const answer2 = answers[field.id];
        if (!answer2 || Array.isArray(answer2) && answer2.length === 0)
          return null;
        const formatted2 = Array.isArray(answer2) ? answer2.join(", ") : answer2;
        return `${field.label}: ${formatted2}`;
      }).filter((line) => Boolean(line));
    }
    const answer = answers[question.id];
    if (!answer || Array.isArray(answer) && answer.length === 0)
      return [];
    const formatted = Array.isArray(answer) ? answer.join(", ") : answer;
    return [`${question.text}: ${formatted}`];
  }).join("\n");
  if (!isApi)
    return lines;
  const contexto = String(answers.contexto_negocio ?? "").trim();
  if (!contexto)
    return lines;
  const trimmed = contexto.length > CONTEXT_MAX_CHARS ? `${contexto.slice(0, CONTEXT_MAX_CHARS)}\u2026` : contexto;
  return `${lines}

--- CONTEXTO EM ABERTO DO EMPRES\xC1RIO (PRIORIZE NA AN\xC1LISE) ---
${trimmed}`;
}

// packages/diagnostico/dist/fallbackReport.js
function buildFallbackReport(answers, scoreInfo) {
  const empresa = String(answers.nome || "sua empresa");
  const setor = String(answers.setor || "seu setor");
  const maiorDor = String(answers.maior_dor || "processos manuais");
  const contexto = String(answers.contexto_negocio || "").trim();
  const foco = contexto ? "as prioridades que voc\xEA descreveu no contexto do neg\xF3cio" : String(answers.maior_dor || "otimizar a opera\xE7\xE3o");
  const contextoBlock = contexto ? `<p>Voc\xEA descreveu a opera\xE7\xE3o assim: <em>\u201C${contexto.slice(0, 500)}${contexto.length > 500 ? "\u2026" : ""}\u201D</em>.
    Esse contexto refor\xE7a que as oportunidades devem atacar gargalos reais do seu dia a dia \u2014 n\xE3o solu\xE7\xF5es gen\xE9ricas de prateleira.</p>` : "";
  return `
    <h2>\u{1F4CD} Diagn\xF3stico da Situa\xE7\xE3o Atual</h2>
    <p><strong>${empresa}</strong> atua em <strong>${setor}</strong> com n\xEDvel <strong>${scoreInfo.label}</strong>.
    A maior dor reportada \xE9 <strong>${maiorDor}</strong>, o que indica oportunidade clara de ganho com automa\xE7\xE3o e IA.</p>
    ${contextoBlock}
    <div class="section-divider"></div>
    <h2>\u{1F3AF} Pr\xF3ximos Passos Recomendados</h2>
    <p>Com base nas suas respostas, o foco principal deve ser <strong>${foco}</strong>.
    Este \xE9 um resumo autom\xE1tico \u2014 a an\xE1lise completa com IA n\xE3o p\xF4de ser gerada neste momento.</p>
    <p>Enquanto isso, use o score e os pilares acima para priorizar onde come\xE7ar. A Dupply pode ajudar a transformar
    essas oportunidades em implementa\xE7\xE3o pr\xE1tica nas primeiras semanas.</p>
  `.trim();
}

// packages/diagnostico/dist/scoring.js
function calcScore(answers) {
  let score = 0;
  const iaMap = {
    "Nunca usamos IA": 0,
    "Estamos explorando": 10,
    "Usamos em algumas \xE1reas": 20,
    "IA faz parte do nosso DNA": 30
  };
  score += iaMap[String(answers.experiencia_ia)] || 0;
  const manuais = Array.isArray(answers.processos_manuais) ? answers.processos_manuais : [];
  score += Math.max(0, 20 - manuais.length * 2.5);
  const dados = (Array.isArray(answers.dados_disponiveis) ? answers.dados_disponiveis : []).filter((item) => item !== "Poucos ou nenhum dado");
  score += Math.min(20, dados.length * 4);
  const decMap = {
    "Por intui\xE7\xE3o e experi\xEAncia": 0,
    "Com base em relat\xF3rios manuais": 5,
    "Com dashboards/BI b\xE1sico": 12,
    "Com an\xE1lise avan\xE7ada de dados": 20
  };
  score += decMap[String(answers.decisoes)] || 0;
  const atMap = {
    "Telefone / WhatsApp manual": 0,
    "Misto / sem padr\xE3o": 2,
    "Chatbot b\xE1sico": 7,
    "Sistema de tickets": 10
  };
  score += atMap[String(answers.atendimento)] || 0;
  return Math.min(100, Math.round(score));
}
function getScoreInfo(score) {
  if (score < 20) {
    return {
      label: "Iniciante Digital",
      color: "#DC2626",
      desc: "Sua empresa tem muito espa\xE7o para crescer com IA \u2014 e isso \xE9 uma grande oportunidade."
    };
  }
  if (score < 40) {
    return {
      label: "Em Digitaliza\xE7\xE3o",
      color: "#D97706",
      desc: "Voc\xEA j\xE1 deu os primeiros passos, mas processos manuais ainda est\xE3o freando seu crescimento."
    };
  }
  if (score < 60) {
    return {
      label: "Maturidade Crescente",
      color: "#0718ff",
      desc: "Boa base tecnol\xF3gica. Com IA nos pontos certos, o impacto pode ser imediato e significativo."
    };
  }
  if (score < 80) {
    return {
      label: "Avan\xE7ado",
      color: "#7C3AED",
      desc: "Voc\xEA est\xE1 \xE0 frente da maioria das empresas. IA pode agora turbinar o que j\xE1 funciona."
    };
  }
  return {
    label: "Refer\xEAncia em IA",
    color: "#059669",
    desc: "Parab\xE9ns! Sua empresa j\xE1 opera com maturidade digital. Hora de ir para o pr\xF3ximo n\xEDvel."
  };
}
function calcPillars(answers) {
  const manuais = Array.isArray(answers.processos_manuais) ? answers.processos_manuais : [];
  const dados = (Array.isArray(answers.dados_disponiveis) ? answers.dados_disponiveis : []).filter((item) => item !== "Poucos ou nenhum dado");
  const iaMap = {
    "Nunca usamos IA": 0,
    "Estamos explorando": 25,
    "Usamos em algumas \xE1reas": 60,
    "IA faz parte do nosso DNA": 100
  };
  const decMap = {
    "Por intui\xE7\xE3o e experi\xEAncia": 10,
    "Com base em relat\xF3rios manuais": 35,
    "Com dashboards/BI b\xE1sico": 65,
    "Com an\xE1lise avan\xE7ada de dados": 95
  };
  const atMap = {
    "Telefone / WhatsApp manual": 15,
    "Misto / sem padr\xE3o": 30,
    "Chatbot b\xE1sico": 65,
    "Sistema de tickets": 80
  };
  return [
    { icon: "\u2699\uFE0F", name: "Automa\xE7\xE3o", score: Math.max(10, 100 - manuais.length * 12) },
    { icon: "\u{1F4CA}", name: "Dados", score: Math.min(95, 10 + dados.length * 17) },
    { icon: "\u{1F916}", name: "Maturidade IA", score: iaMap[String(answers.experiencia_ia)] ?? 5 },
    { icon: "\u{1F9E0}", name: "Decis\xF5es", score: decMap[String(answers.decisoes)] ?? 10 },
    { icon: "\u{1F4AC}", name: "Atendimento", score: atMap[String(answers.atendimento)] ?? 15 }
  ];
}

// apps/api/src/lib/prompt.ts
var DIAGNOSTICO_SYSTEM_PROMPT = `Voc\xEA \xE9 um especialista s\xEAnior em Intelig\xEAncia Artificial e transforma\xE7\xE3o digital para empresas brasileiras. Voc\xEA trabalha para a Dupply, uma consultoria de IA.

Analise o diagn\xF3stico de uma empresa e gere um relat\xF3rio executivo em portugu\xEAs brasileiro, dividido em DUAS PARTES com marcadores obrigat\xF3rios.

REGRAS GERAIS:
- Seja espec\xEDfico e personalizado para o perfil desta empresa
- Se houver se\xE7\xE3o "CONTEXTO EM ABERTO DO EMPRES\xC1RIO", use como fonte principal \u2014 cite situa\xE7\xF5es, processos e dores mencionados pelo empres\xE1rio
- Cruze o contexto em aberto com as respostas do question\xE1rio; evite recomenda\xE7\xF5es gen\xE9ricas que sirvam para qualquer empresa
- Mencione o setor e porte sempre que relevante
- Traga exemplos concretos do dia a dia da opera\xE7\xE3o (n\xE3o s\xF3 categorias gen\xE9ricas)
- Seja direto e orientado a resultados
- Use linguagem do empreendedor brasileiro: pr\xE1tica, objetiva, motivadora
- N\xC3O use linguagem corporativa vaga nem listas de buzzwords
- Retorne APENAS HTML puro, sem markdown, sem blocos de c\xF3digo, sem backticks
- Respeite EXATAMENTE os marcadores <!-- DUPPLY_CLIENT --> e <!-- DUPPLY_INTERNAL --> abaixo

PARTE CLIENTE (entre <!-- DUPPLY_CLIENT --> e <!-- /DUPPLY_CLIENT -->):
- Diagn\xF3stico e oportunidades em n\xEDvel MACRO \u2014 o qu\xEA resolver e por qu\xEA, nunca o como operacional
- PROIBIDO citar nomes de software, apps, plataformas, ERPs, CRMs ou fornecedores
- PROIBIDO passo a passo de implementa\xE7\xE3o ou stack t\xE9cnica
- Foque em benef\xEDcios (horas economizadas, custos, efici\xEAncia, receita) sem entregar a "receita"
- Encerre com 1 par\xE1grafo convidando a falar com a Dupply para desenhar e implementar as solu\xE7\xF5es

PROJE\xC7\xD5ES FINANCEIRAS (na parte cliente \u2014 se\xE7\xE3o Potencial de Retorno):
- Use linguagem conservadora e condicional: "estimativa", "potencial", "pode representar"
- NUNCA invente ROI percentual extremo (ex.: acima de 300%) sem dados expl\xEDcitos no diagn\xF3stico
- Se n\xE3o houver n\xFAmeros suficientes, N\xC3O cite ROI %, break-even nem payback em meses
- Proibido: "ROI de 1500%", "break-even m\xEAs 1", "payback m\xEAs 2" sem base clara

PARTE INTERNA (entre <!-- DUPPLY_INTERNAL --> e <!-- /DUPPLY_INTERNAL -->):
- Somente para uso da equipe Dupply \u2014 pode citar ferramentas, sistemas e apps por nome
- Inclua recomenda\xE7\xF5es pr\xE1ticas de stack e roadmap operacional de 90 dias
- Seja espec\xEDfico: nomes de ferramentas com justificativa e a\xE7\xF5es por fase (dias 1\u201330, 31\u201360, 61\u201390)

FORMATO (retorne s\xF3 o HTML com os marcadores, sem nada antes ou depois):

<!-- DUPPLY_CLIENT -->
<h2>\u{1F4CD} Diagn\xF3stico da Situa\xE7\xE3o Atual</h2>
<p>[an\xE1lise da situa\xE7\xE3o espec\xEDfica]</p>
<div class="section-divider"></div>
<h2>\u{1F3AF} Oportunidades Priorit\xE1rias de IA</h2>
<h3>[Oportunidade 1]</h3><p>[descri\xE7\xE3o macro com impacto estimado \u2014 sem citar ferramentas]</p>
<h3>[Oportunidade 2]</h3><p>[descri\xE7\xE3o]</p>
<div class="section-divider"></div>
<h2>\u{1F5FA}\uFE0F Pr\xF3ximos Passos (vis\xE3o geral)</h2>
<p>[fases em alto n\xEDvel: descoberta, piloto, escala \u2014 sem ferramentas nem passo a passo detalhado]</p>
<div class="section-divider"></div>
<h2>\u{1F4B0} Potencial de Retorno</h2>
<p>[estimativas conservadoras \u2014 horas, custos ou efici\xEAncia; s\xF3 R$ ou % se houver dados no diagn\xF3stico]</p>
<p>[convite para a Dupply ajudar na implementa\xE7\xE3o pr\xE1tica]</p>
<!-- /DUPPLY_CLIENT -->

<!-- DUPPLY_INTERNAL -->
<h2>\u{1F6E0}\uFE0F Ferramentas Recomendadas</h2>
<ul><li><strong>[Ferramenta]</strong> \u2014 [justificativa pr\xE1tica para este cliente]</li></ul>
<div class="section-divider"></div>
<h2>\u{1F5FA}\uFE0F Roadmap de 90 Dias</h2>
<h3>Dias 1\u201330: [t\xEDtulo]</h3><p>[a\xE7\xF5es concretas com ferramentas]</p>
<h3>Dias 31\u201360: [t\xEDtulo]</h3><p>[a\xE7\xF5es]</p>
<h3>Dias 61\u201390: [t\xEDtulo]</h3><p>[a\xE7\xF5es]</p>
<!-- /DUPPLY_INTERNAL -->`;

// apps/api/src/lib/anthropic.ts
function cleanReportHtml(raw) {
  return raw.replace(/```html?/gi, "").replace(/```/g, "").trim();
}
var REPORT_MODEL = "claude-haiku-4-5-20251001";
var MAX_OUTPUT_TOKENS = 4096;
var REQUEST_TIMEOUT_MS = 45e3;
async function requestReport(model, userContent, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: DIAGNOSTICO_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }]
      }),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message ?? `Erro Anthropic (${response.status})`);
    }
    const text = data.content?.find((block) => block.type === "text")?.text ?? data.content?.[0]?.text;
    if (!text) {
      throw new Error("Resposta vazia da Anthropic");
    }
    return cleanReportHtml(text);
  } finally {
    clearTimeout(timeout);
  }
}
async function generateAnthropicReport(summary, meta) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY n\xE3o configurada");
  }
  const scoreLine = meta ? `
score: ${meta.score}/100 (${meta.scoreLabel})` : "";
  const userContent = `Gere o relat\xF3rio com base neste diagn\xF3stico:${scoreLine}

${summary}`;
  const model = REPORT_MODEL;
  return requestReport(model, userContent, REQUEST_TIMEOUT_MS);
}

// apps/api/src/lib/htmlToPlainText.ts
var BLOCK_END_TAGS = /<\/?(?:p|div|h[1-6]|li|tr|blockquote|section|article)\b[^>]*>/gi;
var LINE_BREAK_TAGS = /<br\s*\/?>/gi;
var LIST_ITEM_OPEN = /<li\b[^>]*>/gi;
var HORIZONTAL_RULE = /<hr\b[^>]*>/gi;
function decodeHtmlEntities(value) {
  return value.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&#x27;/gi, "'").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code))).replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}
function sanitizeReportHtml(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").trim();
}
function htmlToPlainText(html) {
  const withoutEmbedded = sanitizeReportHtml(html);
  const withBreaks = withoutEmbedded.replace(LINE_BREAK_TAGS, "\n").replace(HORIZONTAL_RULE, "\n---\n").replace(LIST_ITEM_OPEN, "\n\u2022 ").replace(BLOCK_END_TAGS, (tag) => tag.startsWith("</") ? "\n" : "").replace(/<[^>]+>/g, "");
  return decodeHtmlEntities(withBreaks).replace(/\r\n/g, "\n").replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

// apps/api/src/lib/sheetPayload.ts
function asString(value) {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}
function buildSheetPayload(input) {
  const { answers, score, scoreLabel, reportHtml } = input;
  const payload = {
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    empresa: asString(answers.nome),
    email: asString(answers.email),
    telefone: asString(answers.telefone),
    setor: asString(answers.setor),
    porte: asString(answers.porte),
    faturamento: asString(answers.faturamento),
    score,
    scoreLabel,
    maiorDor: asString(answers.maior_dor),
    budget: asString(answers.budget),
    objetivo: asString(answers.contexto_negocio).slice(0, 200) || asString(answers.maior_dor),
    respostas: answers,
    relatorio: htmlToPlainText(reportHtml).slice(0, 8e3)
  };
  const secret = process.env.DIAGNOSTICO_WEBHOOK_SECRET;
  if (secret) payload.secret = secret;
  return payload;
}

// apps/api/src/lib/googleSheets.ts
async function postSheetPayload(payload) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL n\xE3o configurada");
  }
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "manual"
  });
  let finalResponse = response;
  if (response.status === 302 || response.status === 301) {
    const location = response.headers.get("location");
    if (!location) {
      throw new Error("Google Sheets webhook: redirect sem Location");
    }
    finalResponse = await fetch(location, { method: "GET" });
  }
  const body = await finalResponse.text();
  if (!finalResponse.ok) {
    throw new Error(`Google Sheets webhook falhou (${finalResponse.status}): ${body.slice(0, 300)}`);
  }
  try {
    const parsed = JSON.parse(body);
    if (parsed.ok === false) {
      throw new Error(parsed.error ?? "Google Sheets webhook retornou erro");
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Google Sheets webhook resposta inv\xE1lida: ${body.slice(0, 300)}`);
    }
    throw error;
  }
}
async function saveToGoogleSheets(input) {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn("GOOGLE_SHEETS_WEBHOOK_URL n\xE3o configurada \u2014 lead n\xE3o salvo");
    return;
  }
  await postSheetPayload(buildSheetPayload(input));
}

// apps/api/src/lib/upstash.ts
function isUpstashEnabled() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}
async function upstashCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(command)
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Upstash falhou (${response.status}): ${body.slice(0, 200)}`);
  }
  return await response.json();
}

// apps/api/src/lib/retryQueue.ts
var QUEUE_KEY = "diagnostico:sheet-retry";
async function enqueueSheetRetry(payload, error) {
  const job = {
    payload,
    attempts: 0,
    lastAttemptAt: 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastError: error
  };
  const result = await upstashCommand(["LPUSH", QUEUE_KEY, JSON.stringify(job)]);
  if (!result) {
    console.warn("[retry-queue] Upstash n\xE3o configurado \u2014 job n\xE3o enfileirado");
    return false;
  }
  return true;
}

// apps/api/src/lib/smokeFixture.ts
function createSmokeAnswers() {
  const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
  return {
    nome: `Smoke Test Dupply ${stamp}`,
    email: `smoke+${stamp}@dupply.com.br`,
    telefone: "77999887766",
    setor: "Tecnologia / Software",
    porte: "2 a 10 pessoas",
    faturamento: "R$ 50k a R$ 200k",
    processos_manuais: ["Lan\xE7amento de dados em planilhas", "Resposta a e-mails repetitivos"],
    tempo_desperdicado: "5 a 15 horas",
    sistemas: ["Planilhas (Excel/Sheets)", "WhatsApp Business"],
    atendimento: "Telefone / WhatsApp manual",
    decisoes: "Com base em relat\xF3rios manuais",
    dados_disponiveis: ["Dados financeiros", "Hist\xF3rico de clientes"],
    maior_dor: "Falta de tempo \u2014 apagando inc\xEAndio",
    contexto_negocio: "Somos uma software house com 8 pessoas. Perdemos horas copiando dados entre planilhas e o CRM, e o follow-up comercial depende da mem\xF3ria de cada vendedor.",
    experiencia_ia: "Estamos explorando",
    budget: "R$ 500 a R$ 2.000/m\xEAs"
  };
}

// apps/api/src/diagnostico-smoke.entry.ts
function isAuthorized(req) {
  const secret = process.env.DIAGNOSTICO_TEST_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${secret}`) return true;
  const querySecret = typeof req.query.secret === "string" ? req.query.secret : void 0;
  return querySecret === secret;
}
async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "M\xE9todo n\xE3o permitido" });
  }
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "N\xE3o autorizado \u2014 configure DIAGNOSTICO_TEST_SECRET" });
  }
  const mode = typeof req.query.mode === "string" ? req.query.mode : "full";
  const answers = createSmokeAnswers();
  const summary = buildSummary(answers, { mode: "api" });
  const score = calcScore(answers);
  const scoreInfo = getScoreInfo(score);
  const pillars = calcPillars(answers);
  const checks = {
    mode,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    retryQueueEnabled: isUpstashEnabled(),
    env: {
      anthropicKey: Boolean(process.env.ANTHROPIC_API_KEY),
      sheetsWebhook: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
      upstash: isUpstashEnabled()
    }
  };
  if (mode === "sheets") {
    let sheetSaved2 = false;
    let sheetError2;
    let queued2 = false;
    try {
      await saveToGoogleSheets({
        answers,
        score,
        scoreLabel: scoreInfo.label,
        reportHtml: "<p>Smoke test \u2014 somente planilha</p>"
      });
      sheetSaved2 = true;
    } catch (error) {
      sheetError2 = error instanceof Error ? error.message : "Erro ao salvar";
      queued2 = await enqueueSheetRetry(
        buildSheetPayload({
          answers,
          score,
          scoreLabel: scoreInfo.label,
          reportHtml: "<p>Smoke test \u2014 somente planilha</p>"
        }),
        sheetError2
      );
    }
    return res.status(200).json({
      ok: sheetSaved2 || queued2,
      checks: { ...checks, sheetSaved: sheetSaved2, sheetError: sheetError2, queued: queued2 },
      sample: { empresa: answers.nome, email: answers.email, score }
    });
  }
  let reportHtml;
  let aiGenerated = false;
  let aiError;
  if (mode === "full") {
    try {
      reportHtml = await generateAnthropicReport(summary);
      aiGenerated = true;
    } catch (error) {
      aiError = error instanceof Error ? error.message : "Erro Anthropic";
      reportHtml = buildFallbackReport(answers, scoreInfo);
    }
  } else {
    reportHtml = buildFallbackReport(answers, scoreInfo);
  }
  let sheetSaved = false;
  let sheetError;
  let queued = false;
  try {
    await saveToGoogleSheets({ answers, score, scoreLabel: scoreInfo.label, reportHtml });
    sheetSaved = true;
  } catch (error) {
    sheetError = error instanceof Error ? error.message : "Erro ao salvar";
    queued = await enqueueSheetRetry(
      buildSheetPayload({ answers, score, scoreLabel: scoreInfo.label, reportHtml }),
      sheetError
    );
  }
  const ok = sheetSaved || queued || mode === "ai" && aiGenerated;
  return res.status(200).json({
    ok,
    checks: {
      ...checks,
      aiGenerated,
      aiError,
      sheetSaved,
      sheetError,
      queued
    },
    sample: {
      empresa: answers.nome,
      email: answers.email,
      telefone: answers.telefone,
      score,
      scoreLabel: scoreInfo.label
    },
    pillars,
    reportPreview: reportHtml.slice(0, 280)
  });
}
export {
  handler as default
};
