import type { FlatQuestion, QuestionSection } from './types'

export const questionSections: QuestionSection[] = [
  {
    label: '🏢 Perfil da Empresa',
    questions: [
      {
        id: 'contato',
        type: 'contact',
        text: 'Vamos começar com seus dados',
        hint: 'Usamos essas informações para personalizar seu relatório e entrar em contato, se necessário',
        fields: [
          {
            id: 'nome',
            label: 'Nome da empresa',
            placeholder: 'Ex: Tech Solutions Ltda',
            inputType: 'text',
            required: true,
          },
          {
            id: 'email',
            label: 'E-mail',
            placeholder: 'seu@empresa.com.br',
            inputType: 'email',
            required: true,
          },
          {
            id: 'telefone',
            label: 'Telefone / WhatsApp',
            placeholder: '(77) 99999-9999',
            inputType: 'tel',
            required: true,
          },
        ],
      },
      {
        id: 'setor',
        type: 'select',
        text: 'Em qual setor sua empresa atua?',
        hint: 'Selecione o que mais se aproxima',
        options: [
          'Varejo / E-commerce',
          'Indústria / Manufatura',
          'Saúde / Medicina',
          'Educação',
          'Alimentação / Restaurante',
          'Financeiro / Contabilidade',
          'Imobiliário / Construção',
          'Tecnologia / Software',
          'Logística / Transporte',
          'Serviços Profissionais',
          'Agronegócio',
          'Outro',
        ],
      },
      {
        id: 'porte',
        type: 'single',
        text: 'Quantas pessoas trabalham na sua empresa?',
        hint: 'Inclua colaboradores fixos e terceiros',
        options: [
          { e: '👤', l: 'Só eu (MEI/Solo)', d: 'Negócio individual' },
          { e: '👥', l: '2 a 10 pessoas', d: 'Micro empresa' },
          { e: '🏢', l: '11 a 50 pessoas', d: 'Pequena empresa' },
          { e: '🏙️', l: '51 a 200 pessoas', d: 'Média empresa' },
          { e: '🌆', l: 'Mais de 200 pessoas', d: 'Grande empresa' },
        ],
      },
      {
        id: 'faturamento',
        type: 'single',
        text: 'Qual o faturamento mensal aproximado?',
        hint: 'Faixa aproximada — não precisa ser exato',
        options: [
          { e: '🌱', l: 'Até R$ 50 mil', d: 'Estágio inicial' },
          { e: '📈', l: 'R$ 50k a R$ 200k', d: 'Em crescimento' },
          { e: '💼', l: 'R$ 200k a R$ 1M', d: 'Consolidado' },
          { e: '🚀', l: 'Acima de R$ 1M', d: 'Escala avançada' },
        ],
      },
    ],
  },
  {
    label: '⚙️ Operações & Processos',
    questions: [
      {
        id: 'processos_manuais',
        type: 'multi',
        text: 'Quais tarefas sua equipe faz manualmente hoje?',
        hint: 'Selecione todas que se aplicam',
        options: [
          { e: '📋', l: 'Lançamento de dados em planilhas', d: 'Excel, Google Sheets etc.' },
          { e: '📧', l: 'Resposta a e-mails repetitivos', d: 'Perguntas frequentes, confirmações' },
          { e: '📊', l: 'Geração de relatórios', d: 'Coleta e compilação manual' },
          { e: '📆', l: 'Agendamento e confirmações', d: 'Clientes, fornecedores, equipe' },
          { e: '🧾', l: 'Emissão de notas/cobranças', d: 'NF, boletos, recibos' },
          { e: '📦', l: 'Controle de estoque', d: 'Entrada, saída, inventário' },
          { e: '🔄', l: 'Transferência de dados entre sistemas', d: 'Copiar de um sistema para outro' },
          { e: '📱', l: 'Postagens e conteúdo', d: 'Redes sociais, e-mail marketing' },
        ],
      },
      {
        id: 'tempo_desperdicado',
        type: 'single',
        text: 'Quanto tempo sua equipe perde por semana em tarefas repetitivas?',
        hint: 'Estimativa geral de toda a equipe',
        options: [
          { e: '⚡', l: 'Menos de 2 horas', d: 'Processos bem otimizados' },
          { e: '🕐', l: '2 a 5 horas', d: 'Alguma ineficiência' },
          { e: '🕑', l: '5 a 15 horas', d: 'Perda significativa' },
          { e: '🕒', l: 'Mais de 15 horas', d: 'Urgente otimizar' },
        ],
      },
      {
        id: 'sistemas',
        type: 'multi',
        text: 'Quais sistemas/ferramentas sua empresa usa?',
        hint: 'Selecione todos que utilizam',
        options: [
          { e: '📊', l: 'ERP (SAP, TOTVS, Omie…)', d: 'Gestão empresarial integrada' },
          { e: '👥', l: 'CRM (Salesforce, RD Station…)', d: 'Gestão de clientes' },
          { e: '💬', l: 'WhatsApp Business', d: 'Comunicação com clientes' },
          { e: '📧', l: 'E-mail marketing (RD, Mailchimp…)', d: 'Comunicação em massa' },
          { e: '🛒', l: 'Loja virtual (Shopify, VTEX…)', d: 'E-commerce' },
          { e: '📋', l: 'Planilhas (Excel/Sheets)', d: 'Controles manuais' },
          { e: '💰', l: 'Financeiro (ContaAzul, Nibo…)', d: 'Gestão financeira' },
          { e: '🗂️', l: 'Nenhum sistema específico', d: 'Processos informais' },
        ],
      },
    ],
  },
  {
    label: '👥 Clientes & Vendas',
    questions: [
      {
        id: 'atendimento',
        type: 'single',
        text: 'Como é o atendimento ao cliente hoje?',
        hint: 'Canal principal de suporte',
        options: [
          { e: '📞', l: 'Telefone / WhatsApp manual', d: 'Equipe responde individualmente' },
          { e: '🤖', l: 'Chatbot básico', d: 'Automação parcial' },
          { e: '🎫', l: 'Sistema de tickets', d: 'Help desk organizado' },
          { e: '🔀', l: 'Misto / sem padrão', d: 'Varia conforme a situação' },
        ],
      },
      {
        id: 'volume_atendimento',
        type: 'single',
        text: 'Quantos contatos/atendimentos chegam por dia?',
        hint: 'Somando todos os canais',
        options: [
          { e: '🌿', l: 'Menos de 20', d: 'Volume baixo' },
          { e: '📬', l: '20 a 100', d: 'Volume moderado' },
          { e: '📮', l: '100 a 500', d: 'Volume alto' },
          { e: '🌊', l: 'Mais de 500', d: 'Volume muito alto' },
        ],
      },
      {
        id: 'funil_vendas',
        type: 'multi',
        text: 'Onde estão os maiores gargalos no processo de vendas?',
        hint: 'Selecione todos os pontos críticos',
        options: [
          { e: '🎯', l: 'Geração de leads/prospecção', d: 'Dificuldade em encontrar clientes' },
          { e: '⏳', l: 'Demora no primeiro contato', d: 'Lead esfria antes de ser abordado' },
          { e: '🔁', l: 'Follow-up não acontece', d: 'Equipe esquece de dar retorno' },
          { e: '📉', l: 'Proposta sem padronização', d: 'Cada vendedor faz diferente' },
          { e: '😤', l: 'Pós-venda fraco', d: 'Clientes não são fidelizados' },
          { e: '📊', l: 'Falta de visibilidade do funil', d: 'Não sabe onde estão os negócios' },
        ],
      },
    ],
  },
  {
    label: '📊 Dados & Decisões',
    questions: [
      {
        id: 'decisoes',
        type: 'single',
        text: 'Como as decisões estratégicas são tomadas na empresa?',
        hint: 'Seja honesto — não existe resposta certa ou errada',
        options: [
          { e: '🎲', l: 'Por intuição e experiência', d: 'Sem dados formais' },
          { e: '📋', l: 'Com base em relatórios manuais', d: 'Planilhas e documentos' },
          { e: '📊', l: 'Com dashboards/BI básico', d: 'Alguma visualização de dados' },
          { e: '🧠', l: 'Com análise avançada de dados', d: 'Data-driven consistente' },
        ],
      },
      {
        id: 'dados_disponiveis',
        type: 'multi',
        text: 'Quais dados sua empresa já coleta ou tem acesso?',
        hint: 'Selecione os disponíveis',
        options: [
          { e: '💰', l: 'Dados financeiros', d: 'Receitas, custos, margem' },
          { e: '👥', l: 'Histórico de clientes', d: 'Compras, preferências' },
          { e: '📦', l: 'Dados de estoque/produção', d: 'Quantidades, giro' },
          { e: '📱', l: 'Métricas digitais', d: 'Site, redes sociais, anúncios' },
          { e: '😊', l: 'Satisfação do cliente', d: 'NPS, avaliações' },
          { e: '🔍', l: 'Poucos ou nenhum dado', d: 'Sem coleta estruturada' },
        ],
      },
      {
        id: 'maior_dor',
        type: 'single',
        text: 'Qual é a sua maior dor operacional hoje?',
        hint: 'O problema que mais te tira o sono',
        options: [
          { e: '⏱️', l: 'Falta de tempo — apagando incêndio', d: 'Nunca sobra tempo estratégico' },
          { e: '💸', l: 'Custo alto de operação', d: 'Equipe grande para o que entrega' },
          { e: '📉', l: 'Dificuldade para crescer', d: 'Escalar sem perder qualidade' },
          { e: '🔍', l: 'Falta de visibilidade', d: 'Não sei o que está acontecendo' },
          { e: '😩', l: 'Equipe sobrecarregada', d: 'Pessoas fazendo trabalho de máquina' },
          { e: '🐢', l: 'Processos muito lentos', d: 'Tudo demora mais do que deveria' },
        ],
      },
    ],
  },
  {
    label: '🤖 Maturidade com IA',
    questions: [
      {
        id: 'experiencia_ia',
        type: 'single',
        text: 'Qual é o nível de experiência da sua empresa com IA?',
        hint: 'Seja honesto — isso ajuda a calibrar as recomendações',
        options: [
          { e: '🌱', l: 'Nunca usamos IA', d: 'Interesse mas sem experiência' },
          { e: '🔍', l: 'Estamos explorando', d: 'Testando ferramentas, sem implantação' },
          { e: '⚡', l: 'Usamos em algumas áreas', d: 'Já automatizamos algo' },
          { e: '🚀', l: 'IA faz parte do nosso DNA', d: 'Múltiplas aplicações em produção' },
        ],
      },
      {
        id: 'ferramentas_ia',
        type: 'multi',
        text: 'Quais ferramentas de IA sua empresa já usa ou testou?',
        hint: 'Pode selecionar várias',
        options: [
          { e: '💬', l: 'ChatGPT / Claude / Gemini', d: 'IA generativa para texto' },
          { e: '🎨', l: 'Midjourney / DALL-E', d: 'Geração de imagens' },
          { e: '🤖', l: 'Chatbot de atendimento', d: 'Automação de suporte' },
          { e: '📊', l: 'BI com IA (Power BI, Looker…)', d: 'Analytics inteligente' },
          { e: '📧', l: 'Automação de marketing', d: 'Sequências inteligentes' },
          { e: '🔊', l: 'Transcrição / voz (Whisper…)', d: 'Audio para texto' },
          { e: '🚫', l: 'Nenhuma ainda', d: 'Começando do zero' },
        ],
      },
      {
        id: 'budget',
        type: 'single',
        text: 'Qual o investimento mensal que sua empresa poderia alocar para IA?',
        hint: 'Considerando ferramentas + implementação',
        options: [
          { e: '🌱', l: 'Até R$ 500/mês', d: 'Ferramentas básicas' },
          { e: '📈', l: 'R$ 500 a R$ 2.000/mês', d: 'Soluções intermediárias' },
          { e: '💼', l: 'R$ 2.000 a R$ 10.000/mês', d: 'Implementação robusta' },
          { e: '🚀', l: 'Acima de R$ 10.000/mês', d: 'Transformação digital completa' },
        ],
      },
      {
        id: 'objetivo_principal',
        type: 'single',
        text: 'Qual é o principal objetivo ao implementar IA?',
        hint: 'O resultado mais importante para você',
        options: [
          { e: '⏱️', l: 'Economizar tempo da equipe', d: 'Automatizar tarefas manuais' },
          { e: '💰', l: 'Reduzir custos operacionais', d: 'Fazer mais com menos' },
          { e: '📈', l: 'Aumentar vendas e receita', d: 'IA para crescimento' },
          { e: '😊', l: 'Melhorar experiência do cliente', d: 'Atendimento mais ágil e personalizado' },
          { e: '🔍', l: 'Ter mais controle e visibilidade', d: 'Dados e decisões melhores' },
          { e: '🚀', l: 'Escalar sem contratar', d: 'Crescer sem aumentar equipe' },
        ],
      },
    ],
  },
]

export const allQuestions: FlatQuestion[] = questionSections.flatMap((section) =>
  section.questions.map((question) => ({
    ...question,
    sectionLabel: section.label,
  })),
)

export const TOTAL_QUESTIONS = allQuestions.length
