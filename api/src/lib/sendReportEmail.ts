interface SendReportEmailParams {
  to: string
  companyName: string
  score: number
  scoreLabel: string
  reportHtml: string
  aiGenerated: boolean
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function buildEmailHtml(params: SendReportEmailParams): string {
  const intro = params.aiGenerated
    ? 'Segue a cópia do seu diagnóstico gratuito de IA, gerado com base nas respostas do questionário.'
    : 'Segue a cópia do seu diagnóstico gratuito. A análise completa com IA não pôde ser gerada no momento; o conteúdo abaixo é um resumo automático com base nas suas respostas.'

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Diagnóstico de IA — ${escapeHtml(params.companyName)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f7fa;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#10151d;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid rgba(16,21,29,0.1);border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 20px;border-bottom:1px solid rgba(16,21,29,0.08);">
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0718ff;">Dupply · Diagnóstico de IA</p>
              <h1 style="margin:0 0 8px;font-size:22px;line-height:1.3;">Relatório — ${escapeHtml(params.companyName)}</h1>
              <p style="margin:0;font-size:15px;color:#5f6877;">Score: <strong style="color:#10151d;">${params.score}/100</strong> · ${escapeHtml(params.scoreLabel)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 8px;font-size:15px;line-height:1.6;color:#5f6877;">
              <p style="margin:0 0 16px;">${intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;">
              <div style="padding:20px;border:1px solid rgba(16,21,29,0.1);border-radius:12px;font-size:15px;line-height:1.6;color:#10151d;">
                ${params.reportHtml}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 28px;font-size:13px;line-height:1.5;color:#5f6877;">
              <p style="margin:0;">Dúvidas ou quer implementar IA na prática? Responda este e-mail ou fale com a Dupply pelo site.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function canSendReportEmail(to: string): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.REPORT_EMAIL_FROM && isValidEmail(to))
}

export async function sendReportEmail(params: SendReportEmailParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.REPORT_EMAIL_FROM

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY ou REPORT_EMAIL_FROM não configurados')
  }

  const to = params.to.trim()
  if (!isValidEmail(to)) {
    throw new Error('E-mail do destinatário inválido')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Seu diagnóstico de IA — ${params.companyName} | Dupply`,
      html: buildEmailHtml(params),
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Resend falhou (${response.status}): ${body.slice(0, 300)}`)
  }
}
