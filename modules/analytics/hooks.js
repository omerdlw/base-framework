'use client'

import { useCallback, useEffect, useRef } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import { useAnalytics } from './context'
import {
  DEFAULT_SCROLL_THRESHOLDS,
  getScrollPercentage,
  trackScrollThresholds,
} from './utils/scroll'

export function usePageTracking(properties = {}, options = {}) {
  const analytics = useAnalytics()
  const trackedPaths = useRef(new Set())
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    if (!pathname) return

    const queryString = searchParams?.toString()
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname

    if (!trackedPaths.current.has(fullPath)) {
      analytics.page(fullPath, properties)
      trackedPaths.current.add(fullPath)
    }
  }, [analytics, properties, pathname, searchParams, enabled])
}

export function useEventTracking(eventName, properties = {}) {
  const analytics = useAnalytics()

  return useCallback(
    (eventProperties = {}) => {
      analytics.track(eventName, { ...properties, ...eventProperties })
    },
    [analytics, eventName, properties]
  )
}

export function useUserTracking() {
  const analytics = useAnalytics()

  return {
    identify: useCallback(
      (userId, traits) => {
        analytics.identify(userId, traits)
      },
      [analytics]
    ),

    reset: useCallback(() => {
      analytics.reset()
    }, [analytics]),
  }
}

export function useFormTracking(formSelector = 'form', options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const forms = document.querySelectorAll(formSelector)

    const handleSubmit = (event) => {
      const form = event.target
      const formData = new FormData(form)

      analytics.track('form_submit', {
        form_id: form.id || form.name || 'unknown',
        form_action: form.action,
        form_method: form.method,
        form_fields: Array.from(formData.keys()),
      })
    }

    const handleFocus = (event) => {
      const form = event.target.form
      if (form && !form.dataset.analyticsTracked) {
        form.dataset.analyticsTracked = 'true'
        analytics.track('form_start', {
          form_id: form.id || form.name || 'unknown',
          field_name: event.target.name,
        })
      }
    }

    forms.forEach((form) => {
      form.addEventListener('submit', handleSubmit)
      form.addEventListener('focus', handleFocus, true)
    })

    return () => {
      forms.forEach((form) => {
        form.removeEventListener('submit', handleSubmit)
        form.removeEventListener('focus', handleFocus, true)
      })
    }
  }, [analytics, formSelector, enabled])
}

export function useSearchTracking(searchSelector = '[data-search-query]', options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const searchInputs = document.querySelectorAll(searchSelector)

    const handleSearch = (event) => {
      const query = event.target.value.trim()
      if (query.length > 2) {
        analytics.track('search', {
          search_term: query,
          search_type: 'text_input',
        })
      }
    }

    const handleSearchSubmit = (event) => {
      const form = event.target
      const input = form.querySelector(searchSelector)
      const query = input?.value.trim()

      if (query) {
        analytics.track('search_submit', {
          search_term: query,
          search_results: 'unknown',
        })
      }
    }

    searchInputs.forEach((input) => {
      input.addEventListener('input', handleSearch)
      const form = input.closest('form')
      if (form) {
        form.addEventListener('submit', handleSearchSubmit)
      }
    })

    return () => {
      searchInputs.forEach((input) => {
        input.removeEventListener('input', handleSearch)
        const form = input.closest('form')
        if (form) {
          form.removeEventListener('submit', handleSearchSubmit)
        }
      })
    }
  }, [analytics, searchSelector, enabled])
}

export function useDownloadTracking(options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const handleClick = (event) => {
      const target = event.target.closest('a')
      if (!target) return

      const href = target.href
      const isDownload = href && /\.(pdf|doc|docx|xls|xlsx|zip|rar)$/i.test(href)

      if (isDownload) {
        analytics.track('download', {
          file_url: href,
          file_name: href.split('/').pop(),
          file_extension: href.split('.').pop(),
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [analytics, enabled])
}

export function useOutboundLinkTracking(options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const handleClick = (event) => {
      const target = event.target.closest('a')
      if (!target) return

      const href = target.href
      const isExternal = href && href.startsWith('http') && !href.includes(window.location.hostname)

      if (isExternal) {
        analytics.track('outbound_link', {
          link_url: href,
          link_domain: new URL(href).hostname,
        })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [analytics, enabled])
}

export function useVideoTracking(videoSelector = 'video, [data-video]', options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const videos = document.querySelectorAll(videoSelector)

    const handlePlay = (event) => {
      analytics.track('video_play', {
        video_id: event.target.id || 'unknown',
        video_title: event.target.title || 'unknown',
      })
    }

    const handlePause = (event) => {
      analytics.track('video_pause', {
        video_id: event.target.id || 'unknown',
        video_title: event.target.title || 'unknown',
      })
    }

    const handleEnded = (event) => {
      analytics.track('video_complete', {
        video_id: event.target.id || 'unknown',
        video_title: event.target.title || 'unknown',
      })
    }

    videos.forEach((video) => {
      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
    })

    return () => {
      videos.forEach((video) => {
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
      })
    }
  }, [analytics, videoSelector, enabled])
}

export function useScrollTracking(thresholds = DEFAULT_SCROLL_THRESHOLDS, options = {}) {
  const analytics = useAnalytics()
  const trackedThresholds = useRef(new Set())
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
    if (isDebugMode) {
      console.log('[Analytics] Scroll tracking: Initializing with thresholds', thresholds)
    }

    const handleScroll = () => {
      const scrollPercentage = getScrollPercentage()
      const scrollPosition = window.scrollY

      trackScrollThresholds({
        thresholds,
        trackedThresholds: trackedThresholds.current,
        percentage: scrollPercentage,
        onThreshold: (threshold) => {
          if (isDebugMode) {
            console.log(`[Analytics] Scroll tracking: ${threshold}% threshold reached`)
          }
          analytics.track('scroll_depth', {
            scroll_percentage: threshold,
            scroll_position: scrollPosition,
          })
        },
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [analytics, thresholds, enabled])
}

export function usePerformanceTracking(options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    if (typeof PerformanceObserver === 'undefined' || typeof performance === 'undefined') return

    let paintObserver
    let fcpTime = null

    if (PerformanceObserver.supportedEntryTypes?.includes('paint')) {
      paintObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries().find((e) => e.name === 'first-contentful-paint')
        if (entry) fcpTime = entry.startTime
      })
      paintObserver.observe({ type: 'paint', buffered: true })
    }

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const loadTime =
            Number.isFinite(entry.loadEventEnd) && Number.isFinite(entry.loadEventStart)
              ? entry.loadEventEnd - entry.loadEventStart
              : entry.duration
          const domInteractive =
            Number.isFinite(entry.domInteractive) && Number.isFinite(entry.startTime)
              ? entry.domInteractive - entry.startTime
              : entry.domInteractive
          const paintEntries = performance.getEntriesByType('paint')
          const firstContentfulPaint =
            fcpTime ??
            paintEntries.find((paintEntry) => paintEntry.name === 'first-contentful-paint')
              ?.startTime

          analytics.track('page_performance', {
            load_time: loadTime,
            dom_interactive: domInteractive,
            first_contentful_paint: firstContentfulPaint,
          })
        }
      })
    })

    observer.observe({ type: 'navigation', buffered: true })

    return () => {
      observer.disconnect()
      paintObserver?.disconnect()
    }
  }, [analytics, enabled])
}

export function useErrorTracking(options = {}) {
  const analytics = useAnalytics()
  const { enabled = true } = options

  useEffect(() => {
    if (!enabled) return
    const handleError = (event) => {
      analytics.track('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_lineno: event.lineno,
        error_colno: event.colno,
      })
    }

    const handleUnhandledRejection = (event) => {
      analytics.track('unhandled_rejection', {
        error_message: event.reason?.message || 'Unknown rejection',
        error_stack: event.reason?.stack,
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [analytics, enabled])
}

export function useAutoTracking() {
  const analytics = useAnalytics()
  const eventsConfig = analytics.config?.events || {}

  const isEnabled = (value, fallback = true) => (value === undefined ? fallback : Boolean(value))
  const pageTrackingEnabled = isEnabled(eventsConfig.pageTracking?.enabled, true)
  const formTrackingEnabled = isEnabled(eventsConfig.formTracking?.enabled, true)
  const searchTrackingEnabled = isEnabled(eventsConfig.searchTracking?.enabled, true)
  const downloadTrackingEnabled = isEnabled(eventsConfig.downloadTracking?.enabled, true)
  const outboundTrackingEnabled = isEnabled(eventsConfig.outboundTracking?.enabled, true)
  const videoTrackingEnabled = isEnabled(eventsConfig.videoTracking?.enabled, true)
  const scrollTrackingEnabled = isEnabled(eventsConfig.scrollTracking?.enabled, true)
  const performanceTrackingEnabled = isEnabled(eventsConfig.performanceTracking?.enabled, true)
  const errorTrackingEnabled = isEnabled(eventsConfig.errorTracking?.enabled, true)

  useEffect(() => {
    if (!pageTrackingEnabled) return
    analytics.track('page_view', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    })
  }, [analytics, pageTrackingEnabled])

  usePageTracking({}, { enabled: pageTrackingEnabled })
  useFormTracking('form', { enabled: formTrackingEnabled })
  useSearchTracking(eventsConfig.searchTracking?.searchQuerySelector || '[data-search-query]', {
    enabled: searchTrackingEnabled,
  })
  useDownloadTracking({ enabled: downloadTrackingEnabled })
  useOutboundLinkTracking({ enabled: outboundTrackingEnabled })
  useVideoTracking(eventsConfig.videoTracking?.videoSelector || 'video, [data-video]', {
    enabled: videoTrackingEnabled,
  })
  useScrollTracking(eventsConfig.scrollTracking?.thresholds || DEFAULT_SCROLL_THRESHOLDS, {
    enabled: scrollTrackingEnabled,
  })
  usePerformanceTracking({ enabled: performanceTrackingEnabled })
  useErrorTracking({ enabled: errorTrackingEnabled })
}
