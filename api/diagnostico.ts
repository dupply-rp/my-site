export const config = {
  runtime: 'edge',
}

export default async function handler(request: Request) {
  const { default: handleDiagnostico } = await import('./src/diagnostico.ts')
  return handleDiagnostico(request)
}
