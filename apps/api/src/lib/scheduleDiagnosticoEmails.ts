import type { Answers } from '@dupply/types/diagnostico'

import { sendLeadNotificationEmail, sendReportEmail } from './sendReportEmail'

interface ScheduleDiagnosticoEmailsInput {
  answers: Answers
  reportClientHtml: string
  score: number
  scoreLabel: string
  aiGenerated: boolean
  diagnosticoId?: string | null
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.REPORT_EMAIL_FROM)
}

export function scheduleDiagnosticoEmails(
  waitUntil: (promise: Promise<unknown>) => void,
  input: ScheduleDiagnosticoEmailsInput,
): { emailDispatched: boolean; emailTo?: string } {
  const recipientEmail = String(input.answers.email ?? '').trim()
  const hasValidClientEmail = isValidEmail(recipientEmail)

  if (!isResendConfigured()) {
    if (hasValidClientEmail) {
      console.warn('[diagnostico] E-mail não enviado — configure RESEND_API_KEY e REPORT_EMAIL_FROM')
    }
    console.warn('[diagnostico] Notificação interna não enviada — Resend não configurado')
    return {
      emailDispatched: false,
      emailTo: hasValidClientEmail ? recipientEmail : undefined,
    }
  }

  const emailTasks: Promise<unknown>[] = [
    sendLeadNotificationEmail({
      answers: input.answers,
      score: input.score,
      scoreLabel: input.scoreLabel,
      aiGenerated: input.aiGenerated,
      diagnosticoId: input.diagnosticoId,
    }).catch((error) => {
        const message = error instanceof Error ? error.message : 'Erro ao notificar equipe'
        console.error('[diagnostico] E-mail interno:', message)
      }),
  ]

  if (hasValidClientEmail) {
    emailTasks.push(
      sendReportEmail({
        to: recipientEmail,
        companyName: String(input.answers.nome ?? 'Sua empresa'),
        score: input.score,
        scoreLabel: input.scoreLabel,
        reportHtml: input.reportClientHtml,
        aiGenerated: input.aiGenerated,
      }).catch((error) => {
        const message = error instanceof Error ? error.message : 'Erro ao enviar e-mail'
        console.error('[diagnostico] E-mail cliente:', message)
      }),
    )
  }

  waitUntil(Promise.all(emailTasks))

  return {
    emailDispatched: hasValidClientEmail,
    emailTo: hasValidClientEmail ? recipientEmail : undefined,
  }
}
