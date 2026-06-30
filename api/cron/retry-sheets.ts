import { processRetryQueue } from '../lib/retryQueue'

export const config = {
  runtime: 'edge',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async function handler(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return jsonResponse({ error: 'Não autorizado' }, 401)
  }

  const result = await processRetryQueue(50)

  return jsonResponse({
    ok: true,
    ...result,
    timestamp: new Date().toISOString(),
  })
}
