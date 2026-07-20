import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema'

export type Db = ReturnType<typeof createDb>

// createDb é chamado a cada request; o cache evita abrir um Pool novo por chamada.
const pools = new Map<string, Pool>()

export function createDb(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL
  if (!url) return null

  let pool = pools.get(url)
  if (!pool) {
    pool = new Pool({ connectionString: url, max: 10 })
    pools.set(url, pool)
  }

  return drizzle(pool, { schema })
}
