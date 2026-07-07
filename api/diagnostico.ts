export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new Response(JSON.stringify({ ok: true, service: 'dupply-diagnostico' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
