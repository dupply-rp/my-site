interface UpstashResult {
  result?: unknown
  error?: string
}

export function isUpstashEnabled(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

export async function upstashCommand(command: (string | number)[]): Promise<UpstashResult | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Upstash falhou (${response.status}): ${body.slice(0, 200)}`)
  }

  return (await response.json()) as UpstashResult
}
