import { buildFallbackReports } from '@dupply/diagnostico'
import type { Answers, ScoreInfo } from '@dupply/types/diagnostico'

import { sanitizeReportHtml } from './htmlToPlainText'

export interface DiagnosticoReports {
  clientHtml: string
  internalHtml: string
  fullHtml: string
}

const CLIENT_BLOCK =
  /<!--\s*DUPPLY_CLIENT\s*-->([\s\S]*?)<!--\s*\/DUPPLY_CLIENT\s*-->/i
const INTERNAL_BLOCK =
  /<!--\s*DUPPLY_INTERNAL\s*-->([\s\S]*?)<!--\s*\/DUPPLY_INTERNAL\s*-->/i

const INTERNAL_SECTION_PATTERNS = [/ferramentas\s+recomendadas/i, /roadmap\s+de\s+90/i]

export function joinReportParts(clientHtml: string, internalHtml: string): string {
  const client = clientHtml.trim()
  const internal = internalHtml.trim()
  if (!internal) return client
  if (!client) return internal
  return `${client}\n<div class="section-divider"></div>\n<div data-dupply-internal="true">\n${internal}\n</div>`
}

function splitHtmlByH2Sections(html: string): Array<{ title: string; body: string }> {
  const sections: Array<{ title: string; body: string }> = []
  const parts = html.split(/(?=<h2\b)/i)

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const match = trimmed.match(/^<h2[^>]*>([\s\S]*?)<\/h2>/i)
    if (!match) {
      if (sections.length === 0) {
        sections.push({ title: '', body: trimmed })
      } else {
        sections[sections.length - 1].body += trimmed
      }
      continue
    }

    sections.push({
      title: match[1].replace(/<[^>]+>/g, '').trim(),
      body: trimmed,
    })
  }

  return sections
}

function isInternalSectionTitle(title: string): boolean {
  return INTERNAL_SECTION_PATTERNS.some((pattern) => pattern.test(title))
}

function splitBySectionHeaders(html: string): DiagnosticoReports {
  const sections = splitHtmlByH2Sections(html)
  const clientParts: string[] = []
  const internalParts: string[] = []

  for (const section of sections) {
    if (!section.title || isInternalSectionTitle(section.title)) {
      if (section.body.trim()) internalParts.push(section.body)
    } else {
      clientParts.push(section.body)
    }
  }

  const clientHtml = clientParts.join('\n').trim()
  const internalHtml = internalParts.join('\n<div class="section-divider"></div>\n').trim()

  return {
    clientHtml,
    internalHtml,
    fullHtml: joinReportParts(clientHtml, internalHtml),
  }
}

function stripInternalSectionsFromClient(html: string): string {
  const sections = splitHtmlByH2Sections(html)
  const kept = sections.filter((section) => !section.title || !isInternalSectionTitle(section.title))
  return kept.map((section) => section.body).join('\n').trim()
}

export function splitReportHtml(raw: string): DiagnosticoReports {
  const sanitized = sanitizeReportHtml(raw)
  const clientMatch = sanitized.match(CLIENT_BLOCK)
  const internalMatch = sanitized.match(INTERNAL_BLOCK)

  if (clientMatch) {
    const clientHtml = stripInternalSectionsFromClient(clientMatch[1].trim())
    const internalHtml = internalMatch?.[1]?.trim() ?? ''
    return {
      clientHtml,
      internalHtml,
      fullHtml: joinReportParts(clientHtml, internalHtml),
    }
  }

  return splitBySectionHeaders(sanitized)
}

export function resolveDiagnosticoReports(
  rawHtml: string,
  options: {
    aiGenerated: boolean
    answers: Answers
    scoreInfo: ScoreInfo
  },
): DiagnosticoReports {
  if (!options.aiGenerated) {
    const { clientHtml, internalHtml } = buildFallbackReports(options.answers, options.scoreInfo)
    return {
      clientHtml,
      internalHtml,
      fullHtml: joinReportParts(clientHtml, internalHtml),
    }
  }

  return splitReportHtml(rawHtml)
}
