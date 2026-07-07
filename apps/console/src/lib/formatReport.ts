/** Remove blocos <style>/<script> e CSS vazado (legado do htmlToPlainText). */
function stripStyleAndScriptBlocks(value: string): string {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .trim()
}

/** Remove regras CSS no início do texto (conteúdo que vazou de <style> sem tags). */
function stripLeadingPlainCss(text: string): string {
  let rest = text.trim()
  const ruleBlock =
    /^\s*(?:@[\w-]+\s*(?:\([^)]*\))?\s*)?[.#\w][^{]*\{[\s\S]*?\}\s*/

  while (ruleBlock.test(rest)) {
    rest = rest.replace(ruleBlock, '')
  }

  return rest.trim()
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(value)
}

export interface PreparedReport {
  mode: 'html' | 'text'
  content: string
}

export function prepareReportForDisplay(relatorio: string): PreparedReport | null {
  const raw = relatorio.trim()
  if (!raw) return null

  const withoutBlocks = stripStyleAndScriptBlocks(raw)

  if (looksLikeHtml(withoutBlocks)) {
    return { mode: 'html', content: withoutBlocks || raw }
  }

  const text = stripLeadingPlainCss(withoutBlocks)
  return { mode: 'text', content: text || withoutBlocks || raw }
}
