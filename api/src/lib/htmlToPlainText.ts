const BLOCK_END_TAGS = /<\/?(?:p|div|h[1-6]|li|tr|blockquote|section|article)\b[^>]*>/gi
const LINE_BREAK_TAGS = /<br\s*\/?>/gi
const LIST_ITEM_OPEN = /<li\b[^>]*>/gi
const HORIZONTAL_RULE = /<hr\b[^>]*>/gi

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

export function htmlToPlainText(html: string): string {
  const withBreaks = html
    .replace(LINE_BREAK_TAGS, '\n')
    .replace(HORIZONTAL_RULE, '\n---\n')
    .replace(LIST_ITEM_OPEN, '\n• ')
    .replace(BLOCK_END_TAGS, (tag) => (tag.startsWith('</') ? '\n' : ''))
    .replace(/<[^>]+>/g, '')

  return decodeHtmlEntities(withBreaks)
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
