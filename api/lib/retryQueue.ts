import { postSheetPayload } from './googleSheets'
import type { SheetPayload } from './sheetPayload'
import { upstashCommand } from './upstash'

import { isUpstashEnabled } from './upstash'

export { isUpstashEnabled as isRetryQueueEnabled } from './upstash'

const QUEUE_KEY = 'diagnostico:sheet-retry'
const MAX_ATTEMPTS = 8
const BASE_DELAY_MS = 60_000

export interface RetryJob {
  payload: SheetPayload
  attempts: number
  lastAttemptAt: number
  createdAt: string
  lastError?: string
}

function getRetryDelayMs(attempts: number): number {
  return BASE_DELAY_MS * 2 ** Math.min(attempts, 6)
}

export async function enqueueSheetRetry(payload: SheetPayload, error: string): Promise<boolean> {
  const job: RetryJob = {
    payload,
    attempts: 0,
    lastAttemptAt: 0,
    createdAt: new Date().toISOString(),
    lastError: error,
  }

  const result = await upstashCommand(['LPUSH', QUEUE_KEY, JSON.stringify(job)])
  if (!result) {
    console.warn('[retry-queue] Upstash não configurado — job não enfileirado')
    return false
  }

  return true
}

async function popJob(): Promise<RetryJob | null> {
  const result = await upstashCommand(['RPOP', QUEUE_KEY])
  if (!result?.result) return null

  try {
    return JSON.parse(String(result.result)) as RetryJob
  } catch {
    return null
  }
}

async function requeueJob(job: RetryJob): Promise<void> {
  await upstashCommand(['LPUSH', QUEUE_KEY, JSON.stringify(job)])
}

export async function processRetryQueue(limit = 10): Promise<{
  processed: number
  succeeded: number
  requeued: number
  dropped: number
}> {
  if (!isRetryQueueEnabled()) {
    return { processed: 0, succeeded: 0, requeued: 0, dropped: 0 }
  }

  let processed = 0
  let succeeded = 0
  let requeued = 0
  let dropped = 0

  while (processed < limit) {
    const job = await popJob()
    if (!job) break

    processed++

    const now = Date.now()
    const delayMs = getRetryDelayMs(job.attempts)
    if (job.lastAttemptAt > 0 && now - job.lastAttemptAt < delayMs) {
      await requeueJob(job)
      requeued++
      continue
    }

    try {
      await postSheetPayload(job.payload)
      succeeded++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro desconhecido'
      job.attempts += 1
      job.lastAttemptAt = now
      job.lastError = message

      if (job.attempts >= MAX_ATTEMPTS) {
        console.error('[retry-queue] Job descartado após max tentativas:', message)
        dropped++
        continue
      }

      await requeueJob(job)
      requeued++
    }
  }

  return { processed, succeeded, requeued, dropped }
}
