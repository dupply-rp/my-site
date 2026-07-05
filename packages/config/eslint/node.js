import globals from 'globals'
import { base } from './base.js'

/** @type {import('eslint').Linter.Config[]} */
export const node = [
  ...base,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
]
