#!/usr/bin/env node
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['apps/api/src/diagnostico-handler.entry.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'api/diagnostico-handler.js',
  format: 'esm',
  packages: 'bundle',
  external: ['@vercel/node', '@vercel/functions'],
  logLevel: 'info',
})

console.log('Bundled api/diagnostico-handler.js')
