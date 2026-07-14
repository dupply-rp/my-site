import { createDb, notifyEmails, tenants } from '@dupply/db'
import { and, asc, eq } from 'drizzle-orm'
import { sanitizeEnvValue } from './envUtils'

export interface NotifyEmailItem {
  id: string
  email: string
  label: string | null
  createdAt: Date
}

const DEFAULT_NOTIFY_EMAILS = ['ricardo.lima@dupply.com.br', 'ricardosllacerda@gmail.com']

function requireDb() {
  const db = createDb()
  if (!db) throw new Error('DATABASE_URL não configurada')
  return db
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function getEnvNotifyEmails(): string[] {
  const raw = sanitizeEnvValue(process.env.DIAGNOSTICO_NOTIFY_EMAILS)
  const list = raw
    ? raw.split(',').map((email) => email.trim()).filter(Boolean)
    : DEFAULT_NOTIFY_EMAILS
  return list.filter(isValidEmail).map(normalizeEmail)
}

async function getTenantIdBySlug(slug: string): Promise<string | null> {
  const db = requireDb()
  const [row] = await db.select({ id: tenants.id }).from(tenants).where(eq(tenants.slug, slug)).limit(1)
  return row?.id ?? null
}

async function ensureDefaultNotifyEmails(tenantId: string): Promise<void> {
  const db = requireDb()
  const existing = await db
    .select({ id: notifyEmails.id })
    .from(notifyEmails)
    .where(eq(notifyEmails.tenantId, tenantId))
    .limit(1)

  if (existing.length > 0) return

  const seeds = getEnvNotifyEmails()
  if (seeds.length === 0) return

  await db.insert(notifyEmails).values(
    seeds.map((email) => ({
      tenantId,
      email,
      label: 'Padrão',
    })),
  )
}

export async function listNotifyEmails(tenantSlug: string): Promise<NotifyEmailItem[]> {
  const db = requireDb()
  const tenantId = await getTenantIdBySlug(tenantSlug)
  if (!tenantId) return []

  await ensureDefaultNotifyEmails(tenantId)

  return db
    .select({
      id: notifyEmails.id,
      email: notifyEmails.email,
      label: notifyEmails.label,
      createdAt: notifyEmails.createdAt,
    })
    .from(notifyEmails)
    .where(eq(notifyEmails.tenantId, tenantId))
    .orderBy(asc(notifyEmails.createdAt))
}

export async function addNotifyEmail(
  tenantSlug: string,
  email: string,
  label?: string | null,
): Promise<NotifyEmailItem> {
  const normalized = normalizeEmail(email)
  if (!isValidEmail(normalized)) {
    throw new Error('E-mail inválido')
  }

  const db = requireDb()
  const tenantId = await getTenantIdBySlug(tenantSlug)
  if (!tenantId) {
    throw new Error('Tenant não encontrado')
  }

  const [existing] = await db
    .select({
      id: notifyEmails.id,
      email: notifyEmails.email,
      label: notifyEmails.label,
      createdAt: notifyEmails.createdAt,
    })
    .from(notifyEmails)
    .where(and(eq(notifyEmails.tenantId, tenantId), eq(notifyEmails.email, normalized)))
    .limit(1)

  if (existing) return existing

  const [row] = await db
    .insert(notifyEmails)
    .values({
      tenantId,
      email: normalized,
      label: label?.trim() || null,
    })
    .returning({
      id: notifyEmails.id,
      email: notifyEmails.email,
      label: notifyEmails.label,
      createdAt: notifyEmails.createdAt,
    })

  if (!row) {
    throw new Error('Não foi possível cadastrar o e-mail')
  }

  return row
}

export async function removeNotifyEmail(tenantSlug: string, id: string): Promise<boolean> {
  const db = requireDb()
  const tenantId = await getTenantIdBySlug(tenantSlug)
  if (!tenantId) return false

  const deleted = await db
    .delete(notifyEmails)
    .where(and(eq(notifyEmails.id, id), eq(notifyEmails.tenantId, tenantId)))
    .returning({ id: notifyEmails.id })

  return deleted.length > 0
}

export async function resolveNotifyEmailAddresses(tenantSlug?: string): Promise<string[]> {
  const slug = tenantSlug ?? process.env.DEFAULT_TENANT_SLUG ?? 'dupply'

  try {
    const items = await listNotifyEmails(slug)
    const emails = items.map((item) => item.email).filter(isValidEmail)
    if (emails.length > 0) return emails
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao ler e-mails do banco'
    console.warn('[notify-emails] Fallback para env:', message)
  }

  return getEnvNotifyEmails()
}
