import { verifyConsoleAuthFromToken } from '../../apps/api/src/lib/consoleAuth'
import { getDiagnosticoById, listDiagnosticos } from '../../apps/api/src/lib/consoleQueries'

export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Método não permitido' }, { status: 405 })
  }

  const auth = await verifyConsoleAuthFromToken(request.headers.get('authorization'))
  if (!auth) {
    return Response.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  try {
    if (id) {
      const diagnostico = await getDiagnosticoById(auth.tenantSlug, id)
      if (!diagnostico) {
        return Response.json({ error: 'Diagnóstico não encontrado' }, { status: 404 })
      }
      return Response.json({ diagnostico })
    }

    const limit = Math.min(Number(url.searchParams.get('limit') ?? 100) || 100, 200)
    const items = await listDiagnosticos(auth.tenantSlug, limit)
    return Response.json({ items, total: items.length, tenantSlug: auth.tenantSlug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao consultar banco'
    console.error('[console/diagnosticos]', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
