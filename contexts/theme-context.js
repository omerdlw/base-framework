'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { THEME_CONFIG } from '@/config/theme.config'
import { REGISTRY_TYPES, useRegistryState } from '@/modules/registry/context'

import { useSettings } from './settings-context'

const ThemeContext = createContext(undefined)

export function ThemeProvider({ children }) {
  const { isInitialized: isSettingsInitialized } = useSettings()
  const [isInitialized, setIsInitialized] = useState(false)
  const [pageTheme, setPageTheme] = useState(null)

  const { get } = useRegistryState()
  const registryTheme = get(REGISTRY_TYPES.THEME, 'page-theme')

  const theme = useMemo(
    () => ({
      primary: THEME_CONFIG.colors?.primary || '#0f8fe0',
    }),
    []
  )

  useEffect(() => {
    if (isSettingsInitialized && typeof window !== 'undefined') {
      setIsInitialized(true)
    }
  }, [isSettingsInitialized])

  useEffect(() => {
    if (registryTheme && registryTheme.primary) {
      setPageTheme({ primary: registryTheme.primary })
    } else {
      setPageTheme(null)
    }
  }, [registryTheme])

  useEffect(() => {
    if (!isInitialized) return

    const root = document.documentElement
    const currentTheme = pageTheme || theme

    root.style.setProperty('--color-background', THEME_CONFIG.colors.background)
    root.style.setProperty('--color-text', THEME_CONFIG.colors.text)
    root.style.setProperty('--color-primary', currentTheme.primary || THEME_CONFIG.colors.primary)

    Object.entries(THEME_CONFIG.fixed).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  }, [theme, pageTheme, isInitialized])

  const setPageThemeCallback = useCallback((newTheme) => {
    setPageTheme(newTheme)
  }, [])

  const resetPageTheme = useCallback(() => {
    setPageTheme(null)
  }, [])

  const value = {
    setPageTheme: setPageThemeCallback,
    presets: THEME_CONFIG,
    resetPageTheme,
    theme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div style={{ visibility: isInitialized ? 'visible' : 'hidden' }}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
