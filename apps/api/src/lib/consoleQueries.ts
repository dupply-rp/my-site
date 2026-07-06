import { createDb, diagnosticoRespostas, diagnosticos } from '@dupply/db'
import { desc, eq } from 'drizzle-orm'

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

export async function listDiagnosticos(limit = 100): Promise<DiagnosticoListItem[]> {
  const db = requireDb()

  return db
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
}

export async function getDiagnosticoById(id: string): Promise<DiagnosticoDetail | null> {
  const db = requireDb()

  const [row] = await db.select().from(diagnosticos).where(eq(diagnosticos.id, id)).limit(1)
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
