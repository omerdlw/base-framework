'use client'

import React from 'react'

export function CompactPerformanceMetrics() {
  const [metrics, setMetrics] = React.useState({})
  const [expanded, setExpanded] = React.useState(false)
  const [selectedTab, setSelectedTab] = React.useState('overview')

  React.useEffect(() => {
    const collectMetrics = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        const resources = performance.getEntriesByType('resource')

        const newMetrics = {
          domContentLoaded: Math.round(
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          ),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint:
            paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,
          largestContentfulPaint: 0,
          dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcpConnect: Math.round(navigation.connectEnd - navigation.connectStart),
          serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),
          timeToFirstByte: Math.round(navigation.responseStart - navigation.requestStart),
          totalResources: resources.length,
          totalResourceSize: resources.reduce(
            (sum, resource) => sum + (resource.transferSize || 0),
            0
          ),
          memoryUsed: performance.memory
            ? Math.round(performance.memory.usedJSHeapSize / 1048576)
            : 0,
          connectionType: navigator.connection?.effectiveType || 'unknown',
        }

        setMetrics(newMetrics)
      }
    }

    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        setMetrics((prev) => ({
          ...prev,
          largestContentfulPaint: Math.round(lastEntry.startTime),
        }))
      })

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      return () => lcpObserver.disconnect()
    }

    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
      return () => window.removeEventListener('load', collectMetrics)
    }
  }, [])

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-400'
    if (value <= thresholds.warning) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusBg = (value, thresholds) => {
    if (value <= thresholds.good) return 'bg-green-500/20'
    if (value <= thresholds.warning) return 'bg-yellow-500/20'
    return 'bg-red-500/20'
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  const getConnectionColor = (type) => {
    const colors = {
      '4g': 'text-green-400',
      '3g': 'text-yellow-400',
      '2g': 'text-red-400',
      'slow-2g': 'text-red-600',
      unknown: 'text-slate-400',
    }
    return colors[type] || 'text-slate-400'
  }

  const metricCategories = {
    overview: [
      {
        key: 'loadComplete',
        label: 'Load Time',
        thresholds: { good: 1000, warning: 3000 },
        unit: 'time',
        icon: '⚡',
      },
      {
        key: 'firstContentfulPaint',
        label: 'FCP',
        thresholds: { good: 1500, warning: 2500 },
        unit: 'time',
        icon: '🎨',
      },
      {
        key: 'memoryUsed',
        label: 'Memory',
        thresholds: { good: 50, warning: 100 },
        unit: 'memory',
        icon: '💾',
      },
    ],
    network: [
      {
        key: 'dnsLookup',
        label: 'DNS',
        thresholds: { good: 100, warning: 500 },
        unit: 'time',
        icon: '🌐',
      },
      {
        key: 'serverResponse',
        label: 'Server',
        thresholds: { good: 200, warning: 1000 },
        unit: 'time',
        icon: '🖥️',
      },
      {
        key: 'timeToFirstByte',
        label: 'TTFB',
        thresholds: { good: 600, warning: 1000 },
        unit: 'time',
        icon: '📡',
      },
    ],
    resources: [
      {
        key: 'totalResources',
        label: 'Resources',
        thresholds: { good: 50, warning: 100 },
        unit: 'count',
        icon: '📦',
      },
      {
        key: 'totalResourceSize',
        label: 'Size',
        thresholds: { good: 1048576, warning: 3145728 },
        unit: 'bytes',
        icon: '📊',
      },
    ],
  }

  const getPerformanceScore = () => {
    const overviewMetrics = metricCategories.overview
    let score = 0
    let total = 0

    overviewMetrics.forEach((metric) => {
      const value = metrics[metric.key] || 0
      const thresholds = metric.thresholds

      if (value <= thresholds.good) score += 100
      else if (value <= thresholds.warning) score += 50
      else score += 0

      total += 100
    })

    return Math.round(score / total)
  }

  const performanceScore = getPerformanceScore()

  return (
    <div className='fixed top-4 right-4 z-50 max-w-xs rounded-lg border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-sm'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-700/50 bg-slate-800/80 px-3 py-2'>
        <div>
          <h4 className='flex items-center gap-1 text-sm font-semibold text-white'>
            ⚡ Performance
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${
                performanceScore >= 80
                  ? 'bg-green-500/20 text-green-400'
                  : performanceScore >= 50
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
              }`}
            >
              {performanceScore}
            </span>
          </h4>
          {metrics.connectionType && (
            <div className={`text-[10px] ${getConnectionColor(metrics.connectionType)} mt-0.5`}>
              📶 {metrics.connectionType.toUpperCase()}
            </div>
          )}
        </div>
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
            <span className='text-slate-400'>Load:</span>
            <span
              className={getStatusColor(metrics.loadComplete || 0, { good: 1000, warning: 3000 })}
            >
              {formatTime(metrics.loadComplete || 0)}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Memory:</span>
            <span className={getStatusColor(metrics.memoryUsed || 0, { good: 50, warning: 100 })}>
              {metrics.memoryUsed || 0}MB
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Resources:</span>
            <span className='text-slate-200'>{metrics.totalResources || 0}</span>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {expanded && (
        <>
          {/* Tabs */}
          <div className='flex border-b border-slate-700/50 bg-slate-800/60'>
            {Object.keys(metricCategories).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 px-2 py-1.5 text-[10px] font-medium capitalize transition-colors ${
                  selectedTab === tab
                    ? 'border-b border-blue-400 bg-blue-500/20 text-blue-400'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Metrics Content */}
          <div className='max-h-48 space-y-1.5 overflow-y-auto p-2'>
            {metricCategories[selectedTab].map((metric) => {
              const value = metrics[metric.key] || 0
              const statusColor = getStatusColor(value, metric.thresholds)
              const statusBg = getStatusBg(value, metric.thresholds)

              return (
                <div
                  key={metric.key}
                  className='rounded border border-slate-700/30 bg-slate-800/40 p-2'
                >
                  <div className='mb-1 flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                      <span className='text-sm'>{metric.icon}</span>
                      <div>
                        <div className='text-xs font-medium text-slate-200'>{metric.label}</div>
                        <div className='text-[9px] text-slate-500'>
                          Good: ≤
                          {metric.unit === 'time'
                            ? metric.thresholds.good + 'ms'
                            : metric.unit === 'bytes'
                              ? formatBytes(metric.thresholds.good)
                              : metric.thresholds.good}
                        </div>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className={`text-xs font-semibold ${statusColor}`}>
                        {metric.unit === 'memory'
                          ? `${value}MB`
                          : metric.unit === 'bytes'
                            ? formatBytes(value)
                            : metric.unit === 'count'
                              ? value
                              : formatTime(value)}
                      </div>
                      <div
                        className={`text-[9px] ${statusBg} mt-0.5 inline-block rounded px-1 py-0.5`}
                      >
                        {value <= metric.thresholds.good
                          ? '✅'
                          : value <= metric.thresholds.warning
                            ? '⚠️'
                            : '❌'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className='h-1 overflow-hidden rounded-full bg-slate-700/50'>
                    <div
                      className={`h-full transition-all duration-300 ${
                        value <= metric.thresholds.good
                          ? 'bg-green-400'
                          : value <= metric.thresholds.warning
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                      }`}
                      style={{
                        width: `${Math.min((value / metric.thresholds.warning) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className='flex gap-1.5 border-t border-slate-700/50 bg-slate-800/80 px-3 py-2'>
            <button
              onClick={() => console.log('[Performance] Full metrics:', metrics)}
              className='rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400'
            >
              Log
            </button>
            <button
              onClick={() => {
                if ('performance' in window) {
                  console.log(
                    '[Performance] Navigation:',
                    performance.getEntriesByType('navigation')[0]
                  )
                  console.log('[Performance] Paint:', performance.getEntriesByType('paint'))
                  console.log('[Performance] Memory:', performance.memory)
                }
              }}
              className='rounded border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400'
            >
              Debug
            </button>
          </div>
        </>
      )}
    </div>
  )
}
