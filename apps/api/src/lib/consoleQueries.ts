import { createDb, diagnosticoRespostas, diagnosticos, tenants } from '@dupply/db'
import { and, desc, eq } from 'drizzle-orm'

export interface DiagnosticoListItem {
  id: string
  createdAt: Date
  empresa: string
  email: string | null
  telefone: string | null
  score: number
  scoreLabel: string
  setor: string | null
  porte: string | null
  aiGenerated: boolean
}

export interface DiagnosticoDetail extends DiagnosticoListItem {
  faturamento: string | null
  maiorDor: string | null
  budget: string | null
  objetivo: string | null
  relatorio: string | null
  respostas: Array<{
    id: string
    perguntaId: string
    perguntaTexto: string
    resposta: string
  }>
}

function requireDb() {
  const db = createDb()
  if (!db) throw new Error('DATABASE_URL não configurada')
  return db
}

async function getTenantIdBySlug(slug: string): Promise<string | null> {
  const db = requireDb()
  const [row] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1)
  return row?.id ?? null
}

export async function listDiagnosticos(tenantSlug: string, limit = 100): Promise<DiagnosticoListItem[]> {
  const db = requireDb()
  const tenantId = await getTenantIdBySlug(tenantSlug)

  const conditions = tenantId ? eq(diagnosticos.tenantId, tenantId) : undefined

  const query = db
    .select({
      id: diagnosticos.id,
      createdAt: diagnosticos.createdAt,
      empresa: diagnosticos.empresa,
      email: diagnosticos.email,
      telefone: diagnosticos.telefone,
      score: diagnosticos.score,
      scoreLabel: diagnosticos.scoreLabel,
      setor: diagnosticos.setor,
      porte: diagnosticos.porte,
      aiGenerated: diagnosticos.aiGenerated,
    })
    .from(diagnosticos)
    .orderBy(desc(diagnosticos.createdAt))
    .limit(limit)

  if (conditions) {
    return query.where(conditions)
  }

  return query
}

export async function getDiagnosticoById(
  tenantSlug: string,
  id: string,
): Promise<DiagnosticoDetail | null> {
  const db = requireDb()
  const tenantId = await getTenantIdBySlug(tenantSlug)

  const conditions = tenantId
    ? and(eq(diagnosticos.id, id), eq(diagnosticos.tenantId, tenantId))
    : eq(diagnosticos.id, id)

  const [row] = await db.select().from(diagnosticos).where(conditions).limit(1)
  if (!row) return null

  const respostas = await db
    .select({
      id: diagnosticoRespostas.id,
      perguntaId: diagnosticoRespostas.perguntaId,
      perguntaTexto: diagnosticoRespostas.perguntaTexto,
      resposta: diagnosticoRespostas.resposta,
    })
    .from(diagnosticoRespostas)
    .where(eq(diagnosticoRespostas.diagnosticoId, id))

  return {
    id: row.id,
    createdAt: row.createdAt,
    empresa: row.empresa,
    email: row.email,
    telefone: row.telefone,
    score: row.score,
    scoreLabel: row.scoreLabel,
    setor: row.setor,
    porte: row.porte,
    aiGenerated: row.aiGenerated,
    faturamento: row.faturamento,
    maiorDor: row.maiorDor,
    budget: row.budget,
    objetivo: row.objetivo,
    relatorio: row.relatorio,
    respostas,
  }
}
