import { DIAGNOSTICO_SYSTEM_PROMPT } from './prompt'

interface AnthropicMessage {
  content?: Array<{ type?: string; text?: string }>
}

interface AnthropicResponse {
  content?: AnthropicMessage['content']
  error?: { message?: string }
}

function cleanReportHtml(raw: string): string {
  return raw.replace(/```html?/gi, '').replace(/```/g, '').trim()
}

const SONNET_MODEL = 'claude-sonnet-4-6'
const FAST_MODEL = 'claude-haiku-4-5-20251001'

function getMaxTokens(model: string): number {
  return model.includes('haiku') ? 1800 : 2000
}

async function requestReport(
  model: string,
  summary: string,
  timeoutMs: number,
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: getMaxTokens(model),
      system: DIAGNOSTICO_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analise o diagnóstico desta empresa e gere o relatório:\n\n${summary}`,
        },
      ],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  })

  const data = (await response.json()) as AnthropicResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? `Erro Anthropic (${response.status})`)
  }

  const text = data.content?.find((block) => block.type === 'text')?.text ?? data.content?.[0]?.text

  if (!text) {
    throw new Error('Resposta vazia da Anthropic')
  }

  return cleanReportHtml(text)
}

export async function generateAnthropicReport(summary: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const preferred = process.env.ANTHROPIC_MODEL?.trim()
  const primaryModel = preferred || SONNET_MODEL
  const attempts: Array<{ model: string; timeoutMs: number }> = [
    { model: primaryModel, timeoutMs: 20_000 },
  ]

  if (primaryModel !== FAST_MODEL) {
    attempts.push({ model: FAST_MODEL, timeoutMs: 18_000 })
  }

  let lastError: Error | null = null

  for (const { model, timeoutMs } of attempts) {
    try {
      return await requestReport(model, summary, timeoutMs)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro Anthropic'
      lastError = new Error(message)
      console.error(`[anthropic] Modelo ${model} falhou:`, message)
    }
  }

  throw lastError ?? new Error('Nenhum modelo Anthropic disponível')
}
