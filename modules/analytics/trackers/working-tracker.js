'use client'

import React from 'react'

import { usePathname } from 'next/navigation'

import { useAnalyticsState } from '@/modules/analytics'
import {
  getElementContainer,
  getElementInfo,
  getElementSpecificProps,
} from '@/modules/analytics/utils/element'
import {
  DEFAULT_SCROLL_THRESHOLDS,
  getScrollPercentage,
  trackScrollThresholds,
} from '@/modules/analytics/utils/scroll'

const TRACKING_THRESHOLDS = [...DEFAULT_SCROLL_THRESHOLDS, 100]

export function WorkingTracker() {
  const { trackEvent, trackScrollDepth } = useAnalyticsState()
  const pathname = usePathname()
  const trackedThresholds = React.useRef(new Set())
  const isInitialized = React.useRef(false)
  const currentPath = React.useRef('')
  const trackEventRef = React.useRef(trackEvent)
  const trackScrollDepthRef = React.useRef(trackScrollDepth)

  React.useEffect(() => {
    trackEventRef.current = trackEvent
    trackScrollDepthRef.current = trackScrollDepth
  }, [trackEvent, trackScrollDepth])

  React.useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
    const logDebug = (...args) => {
      if (isDebugMode) console.log(...args)
    }

    if (
      typeof trackEventRef.current !== 'function' ||
      typeof trackScrollDepthRef.current !== 'function'
    ) {
      logDebug('[Working Tracker] State management not ready')
      return
    }

    const handleScroll = () => {
      const scrollPercentage = getScrollPercentage()

      trackScrollThresholds({
        thresholds: TRACKING_THRESHOLDS,
        trackedThresholds: trackedThresholds.current,
        percentage: scrollPercentage,
        onThreshold: (threshold) => {
          logDebug(`[Working Tracker] Scroll ${threshold}% reached`)
          trackScrollDepthRef.current(threshold)
        },
      })

      if (isDebugMode) {
        logDebug(`[Working Tracker] Scroll: ${scrollPercentage}%`)
      }
    }

    const handleClick = (event) => {
      const target = event.target.closest('button, a, [data-track], input, select, textarea, label')
      if (!target) return

      const elementInfo = getElementInfo(target)
      logDebug(`[Working Tracker] Click tracked: ${elementInfo.type}`)

      trackEventRef.current('click', {
        element: elementInfo.type.toLowerCase(),
        text: elementInfo.text,
        container: getElementContainer(target),
        ...getElementSpecificProps(target),
      })
    }

    const handleInput = (event) => {
      const target = event.target
      const elementInfo = getElementInfo(target)
      logDebug(`[Working Tracker] Input tracked: ${elementInfo.type}`)

      trackEventRef.current('input', {
        element: elementInfo.type.toLowerCase(),
        inputType: target.type,
        container: getElementContainer(target),
      })
    }

    const handleChange = (event) => {
      const target = event.target
      const elementInfo = getElementInfo(target)
      logDebug(`[Working Tracker] Change tracked: ${elementInfo.type}`)

      trackEventRef.current('change', {
        element: elementInfo.type.toLowerCase(),
        checked: target.checked,
        inputType: target.type,
        container: getElementContainer(target),
      })
    }

    const handleFocus = (event) => {
      const target = event.target
      const elementInfo = getElementInfo(target)
      logDebug(`[Working Tracker] Focus tracked: ${elementInfo.type}`)

      trackEventRef.current('focus', {
        element: elementInfo.type.toLowerCase(),
        inputType: target.type,
        container: getElementContainer(target),
      })
    }

    const handleBlur = (event) => {
      const target = event.target
      const elementInfo = getElementInfo(target)
      logDebug(`[Working Tracker] Blur tracked: ${elementInfo.type}`)

      trackEventRef.current('blur', {
        element: elementInfo.type.toLowerCase(),
        inputType: target.type,
        container: getElementContainer(target),
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('input', handleInput)
    document.addEventListener('change', handleChange)
    document.addEventListener('focus', handleFocus, true)
    document.addEventListener('blur', handleBlur, true)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('input', handleInput)
      document.removeEventListener('change', handleChange)
      document.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('blur', handleBlur, true)
    }
  }, [])

  React.useEffect(() => {
    if (!pathname) return
    if (typeof trackEventRef.current !== 'function') return

    if (currentPath.current === pathname) return

    const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
    const logDebug = (...args) => {
      if (isDebugMode) console.log(...args)
    }

    if (currentPath.current) {
      logDebug(`[Working Tracker] Route changed from ${currentPath.current} to ${pathname}`)
    }

    currentPath.current = pathname
    trackedThresholds.current.clear()

    trackEventRef.current('page_view', {
      page_path: pathname,
      page_title: document.title,
    })

    logDebug('[Working Tracker] Page view tracked for route change')
  }, [pathname])

  return null
}
