'use client'

import React from 'react'

import { Z_INDEX } from '@/lib/constants'
import { useAnalyticsState } from '@/modules/analytics'

export function AnalyticsStateDebugger() {
  const { userState, sessionState, getSessionMetrics } = useAnalyticsState()
  const [duration, setDuration] = React.useState(0)
  const [currentScroll, setCurrentScroll] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setDuration(Date.now() - sessionState.startTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionState.startTime])

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const scrollPercentage = Math.round((scrollPosition / scrollHeight) * 100)
      setCurrentScroll(scrollPercentage)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  React.useEffect(() => {
    console.log('[Analytics Debugger] Current user state:', userState)
    console.log('[Analytics Debugger] Current session state:', sessionState)

    const metrics = getSessionMetrics()
    console.log('[Analytics Debugger] Session metrics:', metrics)
  }, [userState, sessionState, getSessionMetrics])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '300px',
        zIndex: Z_INDEX.DEBUG_OVERLAY,
        border: '2px solid #007acc',
      }}
    >
      <h4 style={{ margin: '0 0 10px 0', color: '#007acc' }}>🔍 Analytics State</h4>
      <div style={{ marginBottom: '5px' }}>
        <strong>Session:</strong> {userState.sessionCount}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Page Views:</strong> {userState.pageViews}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Events:</strong> {sessionState.events.filter((e) => e.name !== 'page_view').length}
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Scroll:</strong> {currentScroll}% (Max: {Math.max(...sessionState.scrollDepth, 0)}%)
      </div>
      <div style={{ marginBottom: '5px' }}>
        <strong>Duration:</strong> {Math.round(duration / 1000)}s
      </div>
      <button
        onClick={() => console.log('[Analytics Debugger] Full state:', { userState, sessionState })}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        Log Full State
      </button>
    </div>
  )
}
