#!/usr/bin/env node
import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['apps/api/src/server.entry.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outfile: 'apps/api/dist/server.cjs',
  format: 'cjs',
  packages: 'bundle',
  external: ['pg-native'],
  logLevel: 'info',
})

console.log('Bundled apps/api/dist/server.cjs')
