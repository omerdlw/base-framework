'use client'

import { ANALYTICS_CONFIG } from '@/config/analytics.config'
import { AnalyticsProvider } from '@/modules/analytics'
import { AnalyticsStateProvider } from '@/modules/analytics'
import { AnalyticsDebugger } from '@/modules/analytics/debuggers/analytics-debugger'
import { CompactEventStream } from '@/modules/analytics/debuggers/compact-event-stream'
import { CompactPerformanceMetrics } from '@/modules/analytics/debuggers/compact-performance-metrics'
import { CompactStateDebugger } from '@/modules/analytics/debuggers/compact-state-debugger'
import { WorkingTracker } from '@/modules/analytics/trackers/working-tracker'

const isDebugMode = () => {
  return (
    process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
  )
}

const getDebugLevel = () => {
  return process.env.NEXT_PUBLIC_ANALYTICS_DEBUG_LEVEL || 'basic'
}

export function AnalyticsInit({ children }) {
  const debugLevel = getDebugLevel()

  return (
    <AnalyticsProvider config={ANALYTICS_CONFIG}>
      <AnalyticsStateProvider>
        {isDebugMode() && <AnalyticsDebugger />}
        {isDebugMode() && debugLevel !== 'basic' && <CompactEventStream />}
        {isDebugMode() && debugLevel !== 'basic' && <CompactPerformanceMetrics />}
        {isDebugMode() && debugLevel !== 'basic' && <CompactStateDebugger />}
        <WorkingTracker />
        {children}
      </AnalyticsStateProvider>
    </AnalyticsProvider>
  )
}
