import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

import * as schema from './schema'

export type Db = ReturnType<typeof createDb>

export function createDb(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL
  if (!url) return null

  const sql = neon(url)
  return drizzle(sql, { schema })
}
