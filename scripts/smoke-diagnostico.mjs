#!/usr/bin/env node

const baseUrl = (process.env.SMOKE_BASE_URL ?? 'https://dupply.com.br').replace(/\/$/, '')
const secret = process.env.DIAGNOSTICO_TEST_SECRET
const mode = process.env.SMOKE_MODE ?? 'full'

if (!secret) {
  console.error('Defina DIAGNOSTICO_TEST_SECRET antes de rodar o smoke test.')
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
