import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const diagnosticos = pgTable('diagnosticos', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
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
  relatorioCliente: text('relatorio_cliente'),
  relatorioInterno: text('relatorio_interno'),
  aiGenerated: boolean('ai_generated').default(false).notNull(),
})

export const diagnosticoRespostas = pgTable('diagnostico_respostas', {
  id: uuid('id').primaryKey().defaultRandom(),
  diagnosticoId: uuid('diagnostico_id')
    .references(() => diagnosticos.id, { onDelete: 'cascade' })
    .notNull(),
  perguntaId: text('pergunta_id').notNull(),
  perguntaTexto: text('pergunta_texto').notNull(),
  resposta: text('resposta').notNull(),
})
