import { useEffect, useState } from 'react'

import { useTheme } from '@/contexts/theme-context'
import { GET_DOMINANT_COLOR } from '@/lib/utils/client-utils'

export function useImageDominantColor(imageUrl) {
  const { setPageTheme, resetPageTheme } = useTheme()
  const [extractedColor, setExtractedColor] = useState(null)

  useEffect(() => {
    let isMounted = true

    if (!imageUrl) {
      resetPageTheme()
      return
    }

    const extractColor = async () => {
      const color = await GET_DOMINANT_COLOR(imageUrl)
      if (isMounted && color) {
        setExtractedColor(color)
        setPageTheme({ primary: color })
      }
    }

    extractColor()

    return () => {
      isMounted = false
      resetPageTheme()
    }
  }, [imageUrl, setPageTheme, resetPageTheme])

  return extractedColor
}
