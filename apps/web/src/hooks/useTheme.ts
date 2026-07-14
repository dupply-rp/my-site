import { useCallback, useSyncExternalStore } from 'react'
import { applyTheme, getPreferredTheme, setTheme, toggleTheme, type Theme } from '../lib/theme'

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'dark' ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const set = useCallback((next: Theme) => {
    setTheme(next)
  }, [])

  const toggle = useCallback(() => {
    toggleTheme(theme)
  }, [theme])

  return { theme, setTheme: set, toggleTheme: toggle, isLight: theme === 'light' }
}

export function initTheme() {
  applyTheme(getPreferredTheme())
}
