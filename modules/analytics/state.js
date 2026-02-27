'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { GET_STORAGE_ITEM, SET_STORAGE_ITEM } from '@/lib/utils/client-utils'

const AnalyticsStateContext = createContext()
const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
const logDebug = (...args) => {
  if (isDebugMode) console.log(...args)
}

export function AnalyticsStateProvider({ children }) {
  const [userState, setUserState] = useState({
    sessionId: null,
    userId: null,
    firstVisit: null,
    lastVisit: null,
    sessionCount: 0,
    totalSessions: 0,
    pageViews: 0,
    totalTime: 0,
    events: [],
  })

  const [sessionState, setSessionState] = useState({
    startTime: Date.now(),
    currentPage: null,
    scrollDepth: new Set(),
    events: [],
    conversions: [],
  })

  useEffect(() => {
    logDebug('[Analytics State] Initializing state management...')

    const stored = GET_STORAGE_ITEM('analytics_user_state')
    if (stored) {
      const parsed = stored
      logDebug('[Analytics State] Found existing user state:', parsed)
      setUserState((prev) => ({
        ...prev,
        ...parsed,
        lastVisit: Date.now(),
        sessionCount: parsed.sessionCount + 1,
        totalSessions: (parsed.totalSessions || 0) + 1,
      }))
    } else {
      const newUserState = {
        sessionId: generateSessionId(),
        userId: generateUserId(),
        firstVisit: Date.now(),
        lastVisit: Date.now(),
        sessionCount: 1,
        totalSessions: 1,
        pageViews: 0,
        totalTime: 0,
        events: [],
      }
      logDebug('[Analytics State] First visit - creating new user state:', newUserState)
      setUserState(newUserState)
    }

    const newSessionState = {
      startTime: Date.now(),
      currentPage: window.location.pathname,
      scrollDepth: new Set(),
      events: [],
      conversions: [],
    }
    logDebug('[Analytics State] New session started:', newSessionState)
    setSessionState(newSessionState)
  }, [])

  useEffect(() => {
    if (userState.sessionId) {
      SET_STORAGE_ITEM('analytics_user_state', userState)
    }
  }, [userState])

  const trackEvent = useCallback((eventName, properties = {}) => {
    logDebug(`[Analytics State] trackEvent: ${eventName}`)

    const event = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: userState.sessionId,
      page: window.location.pathname,
    }

    logDebug('[Analytics State] Tracking event:', event)

    setSessionState((prev) => ({
      ...prev,
      events: [...prev.events, event],
    }))

    setUserState((prev) => ({
      ...prev,
      events: [...prev.events.slice(-100), event],
      pageViews: eventName === 'page_view' ? prev.pageViews + 1 : prev.pageViews,
    }))
  }, [userState.sessionId])

  const trackScrollDepth = useCallback((percentage) => {
    logDebug(`[Analytics State] trackScrollDepth: ${percentage}%`)
    setSessionState((prev) => ({
      ...prev,
      scrollDepth: new Set([...prev.scrollDepth, percentage]),
    }))
  }, [])

  const trackConversion = useCallback((conversionType, properties = {}) => {
    setSessionState((prev) => ({
      ...prev,
      conversions: [...prev.conversions, {
        type: conversionType,
        properties,
        timestamp: Date.now(),
        sessionId: userState.sessionId,
      }],
    }))
  }, [userState.sessionId])

  const getSessionMetrics = useCallback(() => {
    const duration = Date.now() - sessionState.startTime
    const scrollPercentage = Math.max(...sessionState.scrollDepth, 0)

    const metrics = {
      duration,
      pageViews: sessionState.events.filter((e) => e.name === 'page_view').length,
      eventsCount: sessionState.events.length,
      scrollPercentage,
      conversions: sessionState.conversions.length,
    }

    logDebug('[Analytics State] Session metrics:', metrics)
    return metrics
  }, [sessionState])

  const contextValue = useMemo(
    () => ({
      userState,
      sessionState,
      trackEvent,
      trackScrollDepth,
      trackConversion,
      getSessionMetrics,
    }),
    [userState, sessionState, trackEvent, trackScrollDepth, trackConversion, getSessionMetrics]
  )

  return (
    <AnalyticsStateContext.Provider value={contextValue}>
      {children}
    </AnalyticsStateContext.Provider>
  )
}

export function useAnalyticsState() {
  const context = useContext(AnalyticsStateContext)
  if (!context) {
    throw new Error('useAnalyticsState must be used within AnalyticsStateProvider')
  }
  return context
}

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}

function generateUserId() {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
}
