#!/usr/bin/env node
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['apps/api/src/diagnostico-smoke.entry.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/diagnostico/smoke.bundle.js',
  format: 'esm',
  packages: 'bundle',
  external: ['@vercel/node'],
  logLevel: 'info',
})

console.log('Bundled api/diagnostico/smoke.bundle.js')
