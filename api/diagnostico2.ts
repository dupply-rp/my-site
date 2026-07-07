export const config = {
  runtime: 'edge',
}

export default function handler() {
  return new Response(JSON.stringify({ ok: true, route: 'diagnostico2' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
