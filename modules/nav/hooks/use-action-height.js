'use client'

import { useEffect } from 'react'

export const useActionHeight = (
  onActionHeightChange,
  actionContainerRef,
  ActionComponent,
  isTop
) => {
  useEffect(() => {
    if (!isTop || !onActionHeightChange) return
    if (!ActionComponent) {
      onActionHeightChange(0)
      return
    }
    const element = actionContainerRef.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Fallback to offsetHeight if borderBoxSize is undefined or missing
        const boxSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]?.blockSize
          : entry.borderBoxSize?.blockSize

        // Always fallback to the element's actual layout height for the fastest response
        onActionHeightChange(boxSize || element.offsetHeight)
      }
    })

    observer.observe(element)
    if (element.offsetHeight > 0) {
      onActionHeightChange(element.offsetHeight)
    }

    return () => {
      observer.disconnect()
      onActionHeightChange(0)
    }
  }, [isTop, ActionComponent, onActionHeightChange, actionContainerRef])
}
