#!/usr/bin/env node
import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const port = Number(process.env.PORT ?? 3000)

const { default: diagnosticoHandler } = await import(
  pathToFileURL(resolve(root, 'api/diagnostico-handler.js')).href
)

function createMockRes(serverRes) {
  let statusCode = 200
  const headers = {}

  const res = {
    status(code) {
      statusCode = code
      return res
    },
    setHeader(key, value) {
      headers[key] = value
      return res
    },
    json(body) {
      if (serverRes.writableEnded) return res
      serverRes.writeHead(statusCode, { ...headers, 'Content-Type': 'application/json' })
      serverRes.end(JSON.stringify(body))
      return res
    },
  }

  return res
}

async function readJsonBody(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString()
  if (!raw.trim()) return {}
  return JSON.parse(raw)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://localhost:${port}`)

  if (url.pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, service: 'dupply-diagnostico' }))
    return
  }

  if (url.pathname === '/api/diagnostico-handler') {
    try {
      const body = req.method === 'POST' ? await readJsonBody(req) : {}
      await diagnosticoHandler(
        {
          method: req.method,
          headers: req.headers,
          body,
        },
        createMockRes(res),
      )
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Handler não respondeu' }))
      }
    } catch (error) {
      console.error('[dev-api] Erro:', error)
      if (!res.writableEnded) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Erro interno' }))
      }
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Rota não encontrada' }))
})

server.listen(port, () => {
  console.log(`[dev-api] API local em http://localhost:${port}`)
  console.log(`[dev-api] Diagnóstico: POST http://localhost:${port}/api/diagnostico-handler`)
  console.log('[dev-api] Com o front (pnpm dev:web), use http://localhost:5173/diagnostico')
})
