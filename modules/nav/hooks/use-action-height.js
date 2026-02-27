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
        const boxSize = Array.isArray(entry.contentBoxSize)
          ? entry.contentBoxSize[0]
          : entry.contentBoxSize
        if (boxSize) {
          onActionHeightChange(boxSize.blockSize)
        }
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
