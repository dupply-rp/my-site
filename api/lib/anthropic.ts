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

// Edge Runtime da Vercel limita a resposta a ~25s. Haiku entrega relatório completo dentro do prazo.
const EDGE_MODEL = 'claude-haiku-4-5-20251001'
const MAX_OUTPUT_TOKENS = 2200

async function requestReport(model: string, userContent: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: DIAGNOSTICO_SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
      signal: controller.signal,
    })

    const data = (await response.json()) as AnthropicResponse

    if (!response.ok) {
      throw new Error(data.error?.message ?? `Erro Anthropic (${response.status})`)
    }

    const text =
      data.content?.find((block) => block.type === 'text')?.text ?? data.content?.[0]?.text

    if (!text) {
      throw new Error('Resposta vazia da Anthropic')
    }

    return cleanReportHtml(text)
  } finally {
    clearTimeout(timeout)
  }
}

export async function generateAnthropicReport(
  summary: string,
  meta?: { score: number; scoreLabel: string },
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const scoreLine = meta ? `\nscore: ${meta.score}/100 (${meta.scoreLabel})` : ''
  const userContent = `Gere o relatório com base neste diagnóstico:${scoreLine}\n\n${summary}`

  const model = EDGE_MODEL
  return requestReport(model, userContent, 22_000)
}
