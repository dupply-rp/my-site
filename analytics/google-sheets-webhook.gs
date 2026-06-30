/**
 * Google Apps Script — Diagnósticos Dupply
 *
 * SETUP:
 * 1. Cole este código em Extensões → Apps Script
 * 2. SALVE (Ctrl+S)
 * 3. Implantar → Nova implantação → App da Web → Qualquer pessoa
 * 4. Se editar o código depois: Implantar → Gerenciar implantações → Editar → Nova versão
 *
 * Cabeçalhos linha 1 (A–N):
 * Data/Hora | Empresa | E-mail | Telefone | Setor | Porte | Faturamento |
 * Score | Nível | Maior Dor | Budget IA | Objetivo | Respostas (JSON) | Relatório
 */

/** Abrir a URL no navegador mostra esta mensagem (GET). Normal. */
function doGet() {
  return jsonResponse({
    ok: true,
    message: 'Webhook Dupply ativo. Use POST com JSON para salvar diagnósticos.',
  })
}

/** Recebe os dados do site (POST). */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ ok: false, error: 'Corpo da requisição vazio' })
    }

    const props = PropertiesService.getScriptProperties()
    const expectedSecret = props.getProperty('WEBHOOK_SECRET')
    const data = JSON.parse(e.postData.contents)

    if (expectedSecret && data.secret !== expectedSecret) {
      return jsonResponse({ ok: false, error: 'Unauthorized' })
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]

    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.empresa || '',
      data.email || '',
      data.telefone || '',
      data.setor || '',
      data.porte || '',
      data.faturamento || '',
      data.score ?? '',
      data.scoreLabel || '',
      data.maiorDor || '',
      data.budget || '',
      data.objetivo || '',
      JSON.stringify(data.respostas || {}),
      data.relatorio || '',
    ])

    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) })
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
