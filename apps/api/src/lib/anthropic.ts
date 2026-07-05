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

const DEFAULT_MODEL = 'claude-sonnet-4-6'
const FALLBACK_MODELS = ['claude-sonnet-4-5-20250929', 'claude-haiku-4-5-20251001']

function getModelCandidates(): string[] {
  const preferred = process.env.ANTHROPIC_MODEL?.trim()
  const candidates = [preferred, DEFAULT_MODEL, ...FALLBACK_MODELS].filter(
    (model): model is string => Boolean(model),
  )
  return [...new Set(candidates)]
}

async function requestReport(model: string, summary: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 2800,
      system: DIAGNOSTICO_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analise o diagnóstico desta empresa e gere o relatório:\n\n${summary}`,
        },
      ],
    }),
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

  const models = getModelCandidates()
  let lastError: Error | null = null

  for (const model of models) {
    try {
      return await requestReport(model, summary)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro Anthropic'
      lastError = new Error(message)
      console.error(`[anthropic] Modelo ${model} falhou:`, message)
    }
  }

  throw lastError ?? new Error('Nenhum modelo Anthropic disponível')
}
