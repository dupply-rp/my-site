import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'dist')
const target = resolve(root, '../web/dist/console')

if (!existsSync(source)) {
  console.error('Build do console não encontrado em dist/')
  process.exit(1)
}

mkdirSync(resolve(root, '../web/dist'), { recursive: true })
rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })

console.log('Console copiado para apps/web/dist/console')
