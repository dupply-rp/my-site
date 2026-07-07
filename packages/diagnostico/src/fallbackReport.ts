import type { Answers, ScoreInfo } from '@dupply/types/diagnostico'

export function buildFallbackReport(answers: Answers, scoreInfo: ScoreInfo): string {
  const empresa = String(answers.nome || 'sua empresa')
  const setor = String(answers.setor || 'seu setor')
  const maiorDor = String(answers.maior_dor || 'processos manuais')
  const contexto = String(answers.contexto_negocio || '').trim()
  const foco = contexto
    ? 'as prioridades que você descreveu no contexto do negócio'
    : String(answers.maior_dor || 'otimizar a operação')

  const contextoBlock = contexto
    ? `<p>Você descreveu a operação assim: <em>“${contexto.slice(0, 500)}${contexto.length > 500 ? '…' : ''}”</em>.
    Esse contexto reforça que as oportunidades devem atacar gargalos reais do seu dia a dia — não soluções genéricas de prateleira.</p>`
    : ''

  return `
    <h2>📍 Diagnóstico da Situação Atual</h2>
    <p><strong>${empresa}</strong> atua em <strong>${setor}</strong> com nível <strong>${scoreInfo.label}</strong>.
    A maior dor reportada é <strong>${maiorDor}</strong>, o que indica oportunidade clara de ganho com automação e IA.</p>
    ${contextoBlock}
    <div class="section-divider"></div>
    <h2>🎯 Próximos Passos Recomendados</h2>
    <p>Com base nas suas respostas, o foco principal deve ser <strong>${foco}</strong>.
    Este é um resumo automático — a análise completa com IA não pôde ser gerada neste momento.</p>
    <p>Enquanto isso, use o score e os pilares acima para priorizar onde começar. A Dupply pode ajudar a transformar
    essas oportunidades em implementação prática nas primeiras semanas.</p>
  `.trim()
}
