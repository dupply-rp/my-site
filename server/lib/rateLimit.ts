import { upstashCommand, isUpstashEnabled } from './upstash.js'

const RATE_KEY_PREFIX = 'diagnostico:rate:'

function getLimit(): number {
  const raw = process.env.DIAGNOSTICO_RATE_LIMIT_MAX
  const parsed = raw ? Number.parseInt(raw, 10) : 5
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5
}

function getWindowSeconds(): number {
  const raw = process.env.DIAGNOSTICO_RATE_LIMIT_WINDOW_SEC
  const parsed = raw ? Number.parseInt(raw, 10) : 3600
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 3600
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}

export interface RateLimitResult {
  allowed: boolean
  limit: number
  remaining: number
  resetInSec: number
  enabled: boolean
}

export async function checkDiagnosticoRateLimit(ip: string): Promise<RateLimitResult> {
  const limit = getLimit()
  const windowSec = getWindowSeconds()

  if (!isUpstashEnabled()) {
    console.warn('[rate-limit] Upstash não configurado — limite desativado')
    return { allowed: true, limit, remaining: limit, resetInSec: windowSec, enabled: false }
  }

  const key = `${RATE_KEY_PREFIX}${ip}`

  const countResult = await upstashCommand(['INCR', key])
  const count = Number(countResult?.result ?? 0)

  if (count === 1) {
    await upstashCommand(['EXPIRE', key, windowSec])
  }

  const ttlResult = await upstashCommand(['TTL', key])
  const ttl = Number(ttlResult?.result ?? windowSec)
  const resetInSec = ttl > 0 ? ttl : windowSec

  const allowed = count <= limit
  const remaining = Math.max(0, limit - count)

  return { allowed, limit, remaining, resetInSec, enabled: true }
}
