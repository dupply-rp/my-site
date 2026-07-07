import type { VercelRequest, VercelResponse } from '@vercel/node'

function buildRequest(req: VercelRequest): Request {
  const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'
  const host = req.headers.host ?? 'localhost'
  const url = `${protocol}://${host}${req.url ?? ''}`

  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue
    headers.set(key, Array.isArray(value) ? value.join(', ') : value)
  }

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const body = hasBody
    ? typeof req.body === 'string'
      ? req.body
      : JSON.stringify(req.body ?? {})
    : undefined

  return new Request(url, { method: req.method, headers, body })
}

async function sendResponse(res: VercelResponse, response: Response) {
  const body = await response.text()
  res.status(response.status)
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  res.send(body)
}

export function asNodeHandler(handler: (request: Request) => Promise<Response>) {
  return async function nodeHandler(req: VercelRequest, res: VercelResponse) {
    try {
      const response = await handler(buildRequest(req))
      await sendResponse(res, response)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro interno'
      console.error('[api] handler:', message)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
