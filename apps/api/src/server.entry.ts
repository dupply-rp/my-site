import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import type { VercelRequest, VercelResponse } from '@vercel/node'

import diagnosticoHandler from './diagnostico-handler.entry'
import diagnosticoSmokeHandler from './diagnostico-smoke.entry'
import consoleDiagnosticosHandler from './console-diagnosticos.entry'
import consoleAuthHandler from './console/auth'
import cronRetrySheetsHandler from './cron/retry-sheets'
import healthHandler from './health'

type NodeHandler = (req: VercelRequest, res: VercelResponse) => unknown
type EdgeHandler = (request: globalThis.Request) => globalThis.Response | Promise<globalThis.Response>

// Handlers no estilo Vercel Node (req/res): a API do Express é compatível
// (req.body/req.query, res.status().json(), res.setHeader).
function fromVercel(handler: NodeHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req as unknown as VercelRequest, res as unknown as VercelResponse)).catch(next)
  }
}

// Handlers no estilo Edge (Request → Response da Web API).
function fromEdge(handler: EdgeHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    const run = async () => {
      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers)) {
        if (['content-length', 'content-encoding', 'transfer-encoding'].includes(key)) continue
        if (typeof value === 'string') headers.set(key, value)
        else if (Array.isArray(value)) headers.set(key, value.join(', '))
      }

      const hasBody = req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined
      const request = new globalThis.Request(`http://${req.headers.host ?? 'localhost'}${req.originalUrl}`, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
      })

      const response = await handler(request)
      res.status(response.status)
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.send(Buffer.from(await response.arrayBuffer()))
    }
    run().catch(next)
  }
}

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', true)
app.use(express.json({ limit: '2mb' }))

app.all('/api/health', fromEdge(healthHandler))
app.all('/api/diagnostico-handler', fromVercel(diagnosticoHandler))
app.all('/api/solicitar-contato', fromVercel(diagnosticoHandler))
app.all('/api/diagnostico/smoke', fromVercel(diagnosticoSmokeHandler))
app.all('/api/console/auth', fromEdge(consoleAuthHandler))
app.all('/api/console/diagnosticos', fromVercel(consoleDiagnosticosHandler))
app.all('/api/console/notify-emails', fromVercel(consoleDiagnosticosHandler))
app.all('/api/cron/retry-sheets', fromEdge(cronRetrySheetsHandler))

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Não encontrado' })
})

// O Express só trata como middleware de erro funções com exatamente 4 parâmetros.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Erro não tratado:', error instanceof Error ? error.message : error)
  if (!res.headersSent) {
    res.status(500).json({ error: 'Erro interno' })
  }
})

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => {
  console.log(`[server] dupply-api ouvindo na porta ${port}`)
})
