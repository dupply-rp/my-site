const CLIENT_BLOCK =
  /<!--\s*DUPPLY_CLIENT\s*-->([\s\S]*?)<!--\s*\/DUPPLY_CLIENT\s*-->/i
const INTERNAL_BLOCK =
  /<!--\s*DUPPLY_INTERNAL\s*-->([\s\S]*?)<!--\s*\/DUPPLY_INTERNAL\s*-->/i

const INTERNAL_SECTION_PATTERNS = [/ferramentas\s+recomendadas/i, /roadmap\s+de\s+90/i]

function normalizeSectionTitle(title: string): string {
  return title
    .replace(/<[^>]+>/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u26FF]/gu, '')
    .trim()
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
      title: normalizeSectionTitle(match[1]),
      body: trimmed,
    })
  }

  return sections
}

export function isInternalSectionTitle(title: string): boolean {
  const normalized = normalizeSectionTitle(title)
  return INTERNAL_SECTION_PATTERNS.some((pattern) => pattern.test(normalized))
}

export function extractInternalSectionsHtml(html: string): string {
  const trimmed = html.trim()
  if (!trimmed) return ''

  const internalMatch = trimmed.match(INTERNAL_BLOCK)
  if (internalMatch?.[1]?.trim()) {
    return internalMatch[1].trim()
  }

  const sections = splitHtmlByH2Sections(trimmed)
  const internalParts = sections
    .filter((section) => section.title && isInternalSectionTitle(section.title))
    .map((section) => section.body)

  return internalParts.join('\n<div class="section-divider"></div>\n').trim()
}

export function stripInternalSectionsFromClientHtml(html: string): string {
  const trimmed = html.trim()
  if (!trimmed) return ''

  const clientMatch = trimmed.match(CLIENT_BLOCK)
  if (clientMatch?.[1]?.trim()) {
    const sections = splitHtmlByH2Sections(clientMatch[1].trim())
    return sections
      .filter((section) => !section.title || !isInternalSectionTitle(section.title))
      .map((section) => section.body)
      .join('\n')
      .trim()
  }

  const sections = splitHtmlByH2Sections(trimmed)
  return sections
    .filter((section) => !section.title || !isInternalSectionTitle(section.title))
    .map((section) => section.body)
    .join('\n')
    .trim()
}

export function splitReportForDisplay(html: string): { clientHtml: string; internalHtml: string } {
  const trimmed = html.trim()
  if (!trimmed) {
    return { clientHtml: '', internalHtml: '' }
  }

  const clientMatch = trimmed.match(CLIENT_BLOCK)
  const internalMatch = trimmed.match(INTERNAL_BLOCK)

  if (clientMatch || internalMatch) {
    return {
      clientHtml: clientMatch ? stripInternalSectionsFromClientHtml(clientMatch[1]) : '',
      internalHtml: internalMatch?.[1]?.trim() ?? '',
    }
  }

  return {
    clientHtml: stripInternalSectionsFromClientHtml(trimmed),
    internalHtml: extractInternalSectionsHtml(trimmed),
  }
}
