'use client'

import { useEffect } from 'react'

import { GET_STORAGE_ITEM, SET_STORAGE_ITEM } from '@/lib/utils/client-utils'
import { useAnalytics } from '@/modules/analytics'

export function useEnhancedMeasurement() {
  const analytics = useAnalytics()

  useEffect(() => {
    const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
    const logDebug = (...args) => {
      if (isDebugMode) console.log(...args)
    }

    logDebug('[Analytics] Enhanced Measurement: Initializing...')

    const sendEnhancedEvents = () => {
      logDebug('[Analytics] Enhanced Measurement: Sending events...')

      analytics.track('page_view', {
        page_location: window.location.href,
        page_referrer: document.referrer,
        page_title: document.title,
        page_path: window.location.pathname,
        page_hostname: window.location.hostname,
      })

      analytics.track('user_engagement', {
        engagement_time_msec: 1000,
        session_id: Date.now(),
      })

      const hasVisited = GET_STORAGE_ITEM('has_visited_before')
      if (!hasVisited) {
        analytics.track('first_visit', {
          first_visit_time: Date.now(),
        })
        SET_STORAGE_ITEM('has_visited_before', true)
        logDebug('[Analytics] Enhanced Measurement: First visit tracked')
      }

      const sessionCount = Number(GET_STORAGE_ITEM('session_count') || 0) + 1
      analytics.track('session_start', {
        session_id: Date.now(),
        session_number: sessionCount,
      })
      SET_STORAGE_ITEM('session_count', sessionCount)

      logDebug('[Analytics] Enhanced Measurement: All events sent')
    }

    if (document.readyState === 'complete') {
      sendEnhancedEvents()
    } else {
      window.addEventListener('load', sendEnhancedEvents)
      return () => window.removeEventListener('load', sendEnhancedEvents)
    }
  }, [analytics])
}
