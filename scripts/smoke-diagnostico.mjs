#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

function loadEnvLocal() {
  if (process.env.DIAGNOSTICO_TEST_SECRET) return

  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return

  const content = readFileSync(envPath, 'utf8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in process.env) || process.env[key] === '') {
      process.env[key] = value
    }
  }
}

loadEnvLocal()

const baseUrl = (process.env.SMOKE_BASE_URL ?? 'https://dupply.com.br').replace(/\/$/, '')
const secret = process.env.DIAGNOSTICO_TEST_SECRET?.trim()
const mode = process.env.SMOKE_MODE ?? 'full'

if (!secret) {
  console.error('DIAGNOSTICO_TEST_SECRET não encontrado.')
  console.error('1. Crie em Vercel → Settings → Environment Variables (Production)')
  console.error('2. Rode: pnpm dlx vercel env pull .env.local --environment=production --yes')
  console.error('3. Confirme: grep DIAGNOSTICO_TEST_SECRET .env.local')
  process.exit(1)
}

const url = `${baseUrl}/api/diagnostico/smoke?mode=${encodeURIComponent(mode)}`

const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${secret}`,
    'Content-Type': 'application/json',
  },
})

const body = await response.json()

console.log(JSON.stringify(body, null, 2))

if (!response.ok || !body.ok) {
  process.exit(1)
}
