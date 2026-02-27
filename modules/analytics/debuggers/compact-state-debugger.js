'use client'

import React from 'react'

import { useAnalyticsState } from '@/modules/analytics'

export function CompactStateDebugger() {
  const { userState, sessionState, getSessionMetrics } = useAnalyticsState()
  const [expanded, setExpanded] = React.useState(false)
  const [currentScroll, setCurrentScroll] = React.useState(0)

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

  const duration = Math.round((Date.now() - sessionState.startTime) / 1000)
  const nonPageViewEvents = sessionState.events.filter((e) => e.name !== 'page_view').length
  const maxScroll = Math.max(...sessionState.scrollDepth, 0)

  return (
    <div className='fixed right-4 bottom-4 z-50 max-w-xs rounded-lg border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-sm'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-700/50 bg-slate-800/80 px-3 py-2'>
        <h4 className='flex items-center gap-1 text-sm font-semibold text-white'>🔍 Analytics</h4>
        <button
          onClick={() => setExpanded(!expanded)}
          className='rounded bg-blue-500/20 p-1 text-xs text-blue-400'
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Collapsed State */}
      {!expanded && (
        <div className='space-y-1.5 px-3 py-2 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Views:</span>
            <span className='font-medium text-slate-200'>{userState.pageViews}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Events:</span>
            <span className='font-medium text-slate-200'>{nonPageViewEvents}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Scroll:</span>
            <span className='font-medium text-slate-200'>{currentScroll}%</span>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {expanded && (
        <>
          <div className='space-y-2 px-3 py-2'>
            <div className='grid grid-cols-2 gap-3 text-xs'>
              <div>
                <div className='mb-1 text-slate-400'>Session</div>
                <div className='font-medium text-slate-200'>{userState.sessionCount}</div>
              </div>
              <div>
                <div className='mb-1 text-slate-400'>Page Views</div>
                <div className='font-medium text-slate-200'>{userState.pageViews}</div>
              </div>
              <div>
                <div className='mb-1 text-slate-400'>Events</div>
                <div className='font-medium text-slate-200'>{nonPageViewEvents}</div>
              </div>
              <div>
                <div className='mb-1 text-slate-400'>Duration</div>
                <div className='font-medium text-slate-200'>{duration}s</div>
              </div>
            </div>

            <div className='border-t border-slate-700/50 pt-2'>
              <div className='mb-1 text-xs text-slate-400'>Scroll Depth</div>
              <div className='flex items-center gap-2'>
                <div className='h-2 flex-1 overflow-hidden rounded-full bg-slate-700/50'>
                  <div
                    className='h-full bg-blue-400 transition-all duration-300'
                    style={{ width: `${currentScroll}%` }}
                  />
                </div>
                <span className='min-w-[3rem] text-right text-xs font-medium text-slate-200'>
                  {currentScroll}% (Max: {maxScroll}%)
                </span>
              </div>
            </div>

            <div className='border-t border-slate-700/50 pt-2'>
              <div className='mb-2 text-xs text-slate-400'>Session Info</div>
              <div className='space-y-1 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-slate-500'>Session ID:</span>
                  <span className='font-mono text-[10px] text-slate-300'>
                    {userState.sessionId?.slice(0, 8)}...
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-500'>Total Events:</span>
                  <span className='text-slate-300'>{sessionState.events.length}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-500'>User ID:</span>
                  <span className='font-mono text-[10px] text-slate-300'>
                    {userState.userId?.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className='border-t border-slate-700/50 bg-slate-800/80 px-3 py-2'>
            <button
              onClick={() =>
                console.log('[Analytics Debugger] Full state:', { userState, sessionState })
              }
              className='w-full rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:bg-blue-500/30'
            >
              Log Full State
            </button>
          </div>
        </>
      )}
    </div>
  )
}
