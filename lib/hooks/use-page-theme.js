import { useEffect } from 'react'

import { useTheme } from '@/contexts/theme-context'

export function usePageTheme(themeOverride) {
  const { setPageTheme, resetPageTheme } = useTheme()

  useEffect(() => {
    if (themeOverride) {
      setPageTheme(themeOverride)
    }

    return () => {
      resetPageTheme()
    }
  }, [themeOverride, setPageTheme, resetPageTheme])
}
