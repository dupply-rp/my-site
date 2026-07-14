export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'dupply-theme'

const THEME_COLORS: Record<Theme, string> = {
  light: '#f2f3f5',
  dark: '#1c2628',
}

export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

export function getPreferredTheme(): Theme {
  return getStoredTheme() ?? 'light'
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)

  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) {
    meta.setAttribute('content', THEME_COLORS[theme])
  }
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function toggleTheme(current: Theme): Theme {
  const next = current === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}
