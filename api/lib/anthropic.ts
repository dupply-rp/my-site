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

export async function generateAnthropicReport(summary: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY não configurada')
  }

  const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514'

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
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
