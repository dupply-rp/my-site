import { resolveNotifyEmailAddresses } from './notifyEmailQueries'

interface SendReportEmailParams {
  to: string
  companyName: string
  score: number
  scoreLabel: string
  reportHtml: string
  aiGenerated: boolean
}

interface LeadNotificationParams {
  answers: Record<string, unknown>
  score: number
  scoreLabel: string
  aiGenerated: boolean
  diagnosticoId?: string | null
}

interface ContactRequestParams {
  empresa: string
  email?: string
  telefone?: string
  score?: number
  scoreLabel?: string
}

function asString(value: unknown): string {
  if (value == null) return ''
  if (Array.isArray(value)) return value.join(', ')
  return String(value)
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.REPORT_EMAIL_FROM?.trim())
}

export function mapEmailErrorForClient(error: unknown): string {
  const message = error instanceof Error ? error.message : ''
  if (
    !isResendConfigured() ||
    message.includes('RESEND_NOT_CONFIGURED') ||
    message.includes('REPORT_EMAIL_FROM')
  ) {
    return 'Envio por e-mail indisponível no momento. Fale conosco pelo WhatsApp.'
  }
  if (message.includes('not verified') || message.includes('validation_error') || message.includes('(403)')) {
    return 'Envio por e-mail indisponível no momento. Fale conosco pelo WhatsApp.'
  }
  if (message.includes('Nenhum e-mail de notificação')) {
    return 'Envio por e-mail indisponível no momento. Fale conosco pelo WhatsApp.'
  }
  return 'Não foi possível enviar sua solicitação agora. Fale conosco pelo WhatsApp.'
}

async function postResendEmail(input: {
  to: string[]
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.REPORT_EMAIL_FROM

  if (!apiKey || !from) {
    throw new Error('RESEND_NOT_CONFIGURED')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error('[resend]', response.status, body.slice(0, 500))
    throw new Error(`Resend falhou (${response.status}): ${body.slice(0, 300)}`)
  }
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
  return isResendConfigured() && isValidEmail(to)
}

export async function sendLeadNotificationEmail(params: LeadNotificationParams): Promise<void> {
  const recipients = await resolveNotifyEmailAddresses()
  if (recipients.length === 0) {
    throw new Error('Nenhum e-mail de notificação configurado — cadastre em dupply.com.br/console/emails')
  }

  const empresa = asString(params.answers.nome) || '—'
  const email = asString(params.answers.email) || '—'
  const telefone = asString(params.answers.telefone) || '—'
  const setor = asString(params.answers.setor) || '—'
  const maiorDor = asString(params.answers.maior_dor) || '—'
  const contexto = asString(params.answers.contexto_negocio).trim()
  const isTest = empresa.toUpperCase().startsWith('TC_')
  const consoleLink = params.diagnosticoId
    ? `https://www.dupply.com.br/console/diagnosticos/${params.diagnosticoId}`
    : 'https://www.dupply.com.br/console'

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,sans-serif;color:#10151d;line-height:1.55;">
  <h2>Novo diagnóstico${isTest ? ' (teste TC_)' : ''} — ${escapeHtml(empresa)}</h2>
  <p><strong>Score:</strong> ${params.score}/100 · ${escapeHtml(params.scoreLabel)}</p>
  <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
  <p><strong>Telefone:</strong> ${escapeHtml(telefone)}</p>
  <p><strong>Setor:</strong> ${escapeHtml(setor)}</p>
  <p><strong>Maior dor:</strong> ${escapeHtml(maiorDor)}</p>
  ${contexto ? `<p><strong>Contexto:</strong> ${escapeHtml(contexto.slice(0, 500))}${contexto.length > 500 ? '…' : ''}</p>` : ''}
  <p><strong>Relatório IA:</strong> ${params.aiGenerated ? 'Sim' : 'Fallback'}</p>
  <p><a href="${consoleLink}"><strong>Abrir no console</strong></a> — relatório cliente + Ferramentas e Roadmap (uso interno).</p>
</body>
</html>`

  await postResendEmail({
    to: recipients,
    subject: `Novo diagnóstico — ${empresa} | Dupply`,
    html,
  })
}

export async function sendContactRequestEmail(params: ContactRequestParams): Promise<void> {
  const recipients = await resolveNotifyEmailAddresses()
  if (recipients.length === 0) {
    throw new Error('Nenhum e-mail de notificação configurado')
  }

  const scoreLine =
    params.score != null && params.scoreLabel
      ? `<p><strong>Score do diagnóstico:</strong> ${params.score}/100 · ${escapeHtml(params.scoreLabel)}</p>`
      : ''

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8" /></head>
<body style="font-family:system-ui,sans-serif;color:#10151d;line-height:1.55;">
  <h2>Solicitação de contato — ${escapeHtml(params.empresa)}</h2>
  <p>O lead pediu para a <strong>Dupply entrar em contato</strong> após o diagnóstico.</p>
  ${scoreLine}
  <p><strong>E-mail:</strong> ${escapeHtml(params.email ?? '—')}</p>
  <p><strong>Telefone:</strong> ${escapeHtml(params.telefone ?? '—')}</p>
  <p>Responda o quanto antes pelo console: <a href="https://www.dupply.com.br/console">dupply.com.br/console</a></p>
</body>
</html>`

  await postResendEmail({
    to: recipients,
    subject: `Contato solicitado — ${params.empresa} | Dupply`,
    html,
  })
}

export async function sendReportEmail(params: SendReportEmailParams): Promise<void> {
  const to = params.to.trim()
  if (!isValidEmail(to)) {
    throw new Error('E-mail do destinatário inválido')
  }

  await postResendEmail({
    to: [to],
    subject: `Seu diagnóstico de IA — ${params.companyName} | Dupply`,
    html: buildEmailHtml(params),
  })
}
