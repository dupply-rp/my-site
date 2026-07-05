import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { base } from './base.js'

/** @type {import('eslint').Linter.Config[]} */
export const react = [
  ...base,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]
