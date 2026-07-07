import { buildAnswerRows } from '@dupply/diagnostico'
import { createDb, diagnosticos, diagnosticoRespostas, tenants } from '@dupply/db'
import { eq } from 'drizzle-orm'

import type { Answers } from '@dupply/types/diagnostico'
import { sanitizeReportHtml } from './htmlToPlainText'

interface SaveDiagnosticoInput {
  answers: Answers
  score: number
  scoreLabel: string
  reportHtml: string
  aiGenerated: boolean
}

function asString(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

export async function getDefaultTenantId(db: NonNullable<ReturnType<typeof createDb>>): Promise<string> {
  const slug = process.env.DEFAULT_TENANT_SLUG ?? 'dupply'

  const existing = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1)
  if (existing[0]) return existing[0].id

  const [created] = await db
    .insert(tenants)
    .values({ name: 'Dupply', slug })
    .returning({ id: tenants.id })

  return created.id
}

export async function saveDiagnosticoToDb(input: SaveDiagnosticoInput): Promise<string | null> {
  const db = createDb()
  if (!db) {
    console.warn('DATABASE_URL não configurada — diagnóstico não salvo no banco')
    return null
  }

  const { answers, score, scoreLabel, reportHtml, aiGenerated } = input
  const tenantId = await getDefaultTenantId(db)
  const contexto = asString(answers.contexto_negocio).trim()

  const [diagnostico] = await db
    .insert(diagnosticos)
    .values({
      tenantId,
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
      objetivo: contexto.slice(0, 500) || asString(answers.maior_dor),
      relatorio: sanitizeReportHtml(reportHtml),
      aiGenerated,
    })
    .returning({ id: diagnosticos.id })

  const answerRows = buildAnswerRows(answers)
  if (answerRows.length > 0) {
    await db.insert(diagnosticoRespostas).values(
      answerRows.map((row) => ({
        diagnosticoId: diagnostico.id,
        perguntaId: row.perguntaId,
        perguntaTexto: row.perguntaTexto,
        resposta: row.resposta,
      })),
    )
  }

  return diagnostico.id
}
