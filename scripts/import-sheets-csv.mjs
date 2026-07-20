/**
 * Importa diagnósticos exportados do Google Sheets (CSV) para o Postgres.
 *
 * Uso:
 *   1. No Google Sheets: Arquivo → Fazer download → CSV
 *   2. pnpm db:import-sheets ./caminho/diagnosticos.csv
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { eq, sql } from 'drizzle-orm'
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
})

const diagnosticos = pgTable('diagnosticos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  empresa: text('empresa').notNull(),
  email: text('email'),
  telefone: text('telefone'),
  setor: text('setor'),
  porte: text('porte'),
  faturamento: text('faturamento'),
  score: integer('score').notNull(),
  scoreLabel: text('score_label').notNull(),
  maiorDor: text('maior_dor'),
  budget: text('budget'),
  objetivo: text('objetivo'),
  relatorio: text('relatorio'),
  aiGenerated: boolean('ai_generated').default(false).notNull(),
})

const diagnosticoRespostas = pgTable('diagnostico_respostas', {
  id: uuid('id').primaryKey().defaultRandom(),
  diagnosticoId: uuid('diagnostico_id').notNull(),
  perguntaId: text('pergunta_id').notNull(),
  perguntaTexto: text('pergunta_texto').notNull(),
  resposta: text('resposta').notNull(),
})

function parseCsv(content) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i]
    const next = content[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        cell += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(cell)
      cell = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1
      row.push(cell)
      if (row.some((value) => value.trim())) rows.push(row)
      row = []
      cell = ''
      continue
    }

    cell += char
  }

  if (cell.length || row.length) {
    row.push(cell)
    if (row.some((value) => value.trim())) rows.push(row)
  }

  return rows
}

async function getDefaultTenantId(db) {
  const slug = process.env.DEFAULT_TENANT_SLUG ?? 'dupply'
  const existing = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1)
  if (existing[0]) return existing[0].id

  const [created] = await db.insert(tenants).values({ name: 'Dupply', slug }).returning({ id: tenants.id })
  return created.id
}

async function main() {
  const csvPath = resolve(process.argv[2] ?? '')
  if (!csvPath || csvPath === resolve('.')) {
    console.error('Informe o caminho do CSV: pnpm db:import-sheets ./diagnosticos.csv')
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL não configurada')
    process.exit(1)
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db = drizzle(pool)

  try {
    const content = readFileSync(csvPath, 'utf8')
    const rows = parseCsv(content)
    const [, ...dataRows] = rows

    const tenantId = await getDefaultTenantId(db)
    let imported = 0
    let skipped = 0

    for (const columns of dataRows) {
    const [
      createdAtRaw,
      empresa,
      email,
      telefone,
      setor,
      porte,
      faturamento,
      scoreRaw,
      scoreLabel,
      maiorDor,
      budget,
      objetivo,
      respostasJson,
      relatorio,
    ] = columns

    if (!empresa?.trim()) {
      skipped += 1
      continue
    }

    const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date()
    const score = Number(scoreRaw ?? 0) || 0

    const [inserted] = await db
      .insert(diagnosticos)
      .values({
        tenantId,
        createdAt,
        empresa: empresa.trim(),
        email: email?.trim() || null,
        telefone: telefone?.trim() || null,
        setor: setor?.trim() || null,
        porte: porte?.trim() || null,
        faturamento: faturamento?.trim() || null,
        score,
        scoreLabel: scoreLabel?.trim() || '—',
        maiorDor: maiorDor?.trim() || null,
        budget: budget?.trim() || null,
        objetivo: objetivo?.trim() || null,
        relatorio: relatorio?.trim() || null,
        aiGenerated: true,
      })
      .returning({ id: diagnosticos.id })

    if (respostasJson?.trim()) {
      try {
        const parsed = JSON.parse(respostasJson)
        const answerRows = Object.entries(parsed).map(([perguntaId, value]) => ({
          diagnosticoId: inserted.id,
          perguntaId,
          perguntaTexto: perguntaId,
          resposta: Array.isArray(value) ? value.join(', ') : String(value),
        }))

        if (answerRows.length > 0) {
          await db.insert(diagnosticoRespostas).values(answerRows)
        }
      } catch {
        console.warn(`Respostas inválidas para ${empresa}`)
      }
    }

    imported += 1
    }

    const [{ total }] = await db
      .select({ total: sql`count(*)::int` })
      .from(diagnosticos)
      .where(eq(diagnosticos.tenantId, tenantId))

    console.log(`Importação concluída: ${imported} importados, ${skipped} ignorados.`)
    console.log(`Total no tenant: ${total}`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
