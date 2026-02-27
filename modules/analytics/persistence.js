'use client'

import { useEffect } from 'react'

import { useAnalyticsState } from '@/modules/analytics'

export function useAnalyticsPersistence() {
  const { userState, sessionState, trackEvent, trackScrollDepth, getSessionMetrics } =
    useAnalyticsState()

  useEffect(() => {
    const handleBeforeUnload = () => {
      const metrics = getSessionMetrics()

      localStorage.setItem(
        'analytics_session_data',
        JSON.stringify({
          sessionId: userState.sessionId,
          metrics,
          events: sessionState.events,
          scrollDepth: Array.from(sessionState.scrollDepth),
          timestamp: Date.now(),
        })
      )
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        trackEvent('session_pause', {
          session_duration: Date.now() - sessionState.startTime,
          page_views: sessionState.events.filter((e) => e.name === 'page_view').length,
        })
      } else if (document.visibilityState === 'visible') {
        trackEvent('session_resume', {
          session_duration: Date.now() - sessionState.startTime,
        })
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [userState, sessionState, trackEvent, getSessionMetrics])

  const enhancedScrollTracking = (percentage) => {
    trackScrollDepth(percentage)
    trackEvent('scroll_depth', {
      scroll_percentage: percentage,
      session_id: userState.sessionId,
      total_scrolls: sessionState.scrollDepth.size,
    })
  }

  const enhancedPageTracking = (path) => {
    trackEvent('page_view', {
      page_path: path,
      session_id: userState.sessionId,
      session_page_views: sessionState.events.filter((e) => e.name === 'page_view').length + 1,
      total_page_views: userState.pageViews + 1,
    })
  }

  return {
    enhancedScrollTracking,
    enhancedPageTracking,
    userState,
    sessionState,
    getSessionMetrics,
  }
}
