export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  if (request.method === 'GET') {
    return Response.json({ ok: true, service: 'dupply-diagnostico' })
  }

  return Response.json({ error: 'Método não permitido' }, { status: 405 })
}
