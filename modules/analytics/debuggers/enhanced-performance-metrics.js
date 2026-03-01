'use client'

import React from 'react'

import { Z_INDEX } from '@/lib/constants'

export function EnhancedPerformanceMetrics() {
  const [metrics, setMetrics] = React.useState({})
  const [expanded, setExpanded] = React.useState(true)
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
          sslNegotiation: Math.round(
            navigation.secureConnectionStart > 0
              ? navigation.connectEnd - navigation.secureConnectionStart
              : 0
          ),
          serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),
          timeToFirstByte: Math.round(navigation.responseStart - navigation.requestStart),

          totalResources: resources.length,
          totalResourceSize: resources.reduce(
            (sum, resource) => sum + (resource.transferSize || 0),
            0
          ),
          imageResources: resources.filter((r) => r.initiatorType === 'img').length,
          scriptResources: resources.filter((r) => r.initiatorType === 'script').length,
          cssResources: resources.filter((r) => r.initiatorType === 'link').length,

          memoryUsed: performance.memory
            ? Math.round(performance.memory.usedJSHeapSize / 1048576)
            : 0,
          memoryTotal: performance.memory
            ? Math.round(performance.memory.totalJSHeapSize / 1048576)
            : 0,
          memoryLimit: performance.memory
            ? Math.round(performance.memory.jsHeapSizeLimit / 1048576)
            : 0,

          connectionType: navigator.connection?.effectiveType || 'unknown',
          downlink: navigator.connection?.downlink || 0,
          rtt: navigator.connection?.rtt || 0,
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
    if (value <= thresholds.good) return '#22c55e'
    if (value <= thresholds.warning) return '#f59e0b'
    return '#ef4444'
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const formatBytes = (bytes) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  const getConnectionColor = (type) => {
    const colors = {
      '4g': '#22c55e',
      '3g': '#f59e0b',
      '2g': '#ef4444',
      'slow-2g': '#991b1b',
      unknown: '#6b7280',
    }
    return colors[type] || '#6b7280'
  }

  const metricCategories = {
    overview: [
      {
        key: 'loadComplete',
        label: 'Page Load Time',
        thresholds: { good: 1000, warning: 3000 },
        unit: 'time',
        icon: '⚡',
      },
      {
        key: 'firstContentfulPaint',
        label: 'First Contentful Paint',
        thresholds: { good: 1500, warning: 2500 },
        unit: 'time',
        icon: '🎨',
      },
      {
        key: 'largestContentfulPaint',
        label: 'Largest Contentful Paint',
        thresholds: { good: 2500, warning: 4000 },
        unit: 'time',
        icon: '🖼️',
      },
      {
        key: 'memoryUsed',
        label: 'Memory Usage',
        thresholds: { good: 50, warning: 100 },
        unit: 'memory',
        icon: '💾',
      },
    ],
    network: [
      {
        key: 'dnsLookup',
        label: 'DNS Lookup',
        thresholds: { good: 100, warning: 500 },
        unit: 'time',
        icon: '🌐',
      },
      {
        key: 'tcpConnect',
        label: 'TCP Connect',
        thresholds: { good: 100, warning: 500 },
        unit: 'time',
        icon: '🔌',
      },
      {
        key: 'serverResponse',
        label: 'Server Response',
        thresholds: { good: 200, warning: 1000 },
        unit: 'time',
        icon: '🖥️',
      },
      {
        key: 'timeToFirstByte',
        label: 'Time to First Byte',
        thresholds: { good: 600, warning: 1000 },
        unit: 'time',
        icon: '📡',
      },
    ],
    resources: [
      {
        key: 'totalResources',
        label: 'Total Resources',
        thresholds: { good: 50, warning: 100 },
        unit: 'count',
        icon: '📦',
      },
      {
        key: 'totalResourceSize',
        label: 'Total Size',
        thresholds: { good: 1048576, warning: 3145728 },
        unit: 'bytes',
        icon: '📊',
      },
      {
        key: 'imageResources',
        label: 'Image Resources',
        thresholds: { good: 20, warning: 50 },
        unit: 'count',
        icon: '🖼️',
      },
      {
        key: 'scriptResources',
        label: 'Script Resources',
        thresholds: { good: 10, warning: 25 },
        unit: 'count',
        icon: '📜',
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
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
        color: 'white',
        padding: '0',
        borderRadius: '12px',
        fontSize: '12px',
        width: expanded ? '400px' : '320px',
        maxHeight: expanded ? '700px' : '200px',
        overflow: 'hidden',
        zIndex: Z_INDEX.DEBUG_OVERLAY,
        border: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '16px',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ⚡ Performance
            <span
              style={{
                background:
                  performanceScore >= 80
                    ? 'rgba(34, 197, 94, 0.2)'
                    : performanceScore >= 50
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                color:
                  performanceScore >= 80
                    ? '#22c55e'
                    : performanceScore >= 50
                      ? '#f59e0b'
                      : '#ef4444',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '500',
              }}
            >
              {performanceScore}/100
            </span>
          </h4>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
            {metrics.connectionType && (
              <span
                style={{
                  color: getConnectionColor(metrics.connectionType),
                  marginRight: '8px',
                }}
              >
                📶 {metrics.connectionType.toUpperCase()}
              </span>
            )}
            Real-time performance metrics
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Quick Summary */}
      {!expanded && (
        <div style={{ padding: '16px', fontSize: '11px', lineHeight: '1.6' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Load Time</span>
            <span
              style={{
                color: getStatusColor(metrics.loadComplete || 0, { good: 1000, warning: 3000 }),
                fontWeight: '600',
              }}
            >
              {formatTime(metrics.loadComplete || 0)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '8px',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Memory</span>
            <span
              style={{
                color: getStatusColor(metrics.memoryUsed || 0, { good: 50, warning: 100 }),
                fontWeight: '600',
              }}
            >
              {metrics.memoryUsed || 0}MB
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#94a3b8' }}>Resources</span>
            <span style={{ color: '#e2e8f0', fontWeight: '600' }}>
              {metrics.totalResources || 0}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {expanded && (
        <>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
              background: 'rgba(15, 23, 42, 0.6)',
            }}
          >
            {Object.keys(metricCategories).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  background: selectedTab === tab ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  color: selectedTab === tab ? '#60a5fa' : '#94a3b8',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  borderBottom: selectedTab === tab ? '2px solid #60a5fa' : 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Metrics Content */}
          <div
            style={{
              maxHeight: '350px',
              overflowY: 'auto',
              padding: '12px',
            }}
          >
            {metricCategories[selectedTab].map((metric) => {
              const value = metrics[metric.key] || 0
              const color = getStatusColor(value, metric.thresholds)

              return (
                <div
                  key={metric.key}
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{metric.icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#e2e8f0',
                          }}
                        >
                          {metric.label}
                        </div>
                        <div
                          style={{
                            fontSize: '9px',
                            color: '#64748b',
                            marginTop: '1px',
                          }}
                        >
                          Good: ≤
                          {metric.unit === 'time'
                            ? metric.thresholds.good + 'ms'
                            : metric.unit === 'bytes'
                              ? formatBytes(metric.thresholds.good)
                              : metric.thresholds.good}
                          , Warning: ≤
                          {metric.unit === 'time'
                            ? metric.thresholds.warning + 'ms'
                            : metric.unit === 'bytes'
                              ? formatBytes(metric.thresholds.warning)
                              : metric.thresholds.warning}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: color,
                        }}
                      >
                        {metric.unit === 'memory'
                          ? `${value}MB`
                          : metric.unit === 'bytes'
                            ? formatBytes(value)
                            : metric.unit === 'count'
                              ? value
                              : formatTime(value)}
                      </div>
                      <div
                        style={{
                          fontSize: '8px',
                          marginTop: '2px',
                        }}
                      >
                        {value <= metric.thresholds.good
                          ? '✅ Excellent'
                          : value <= metric.thresholds.warning
                            ? '⚠️ Needs Improvement'
                            : '❌ Poor'}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      height: '4px',
                      background: 'rgba(148, 163, 184, 0.2)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min((value / metric.thresholds.warning) * 100, 100)}%`,
                        background: color,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Actions */}
      {expanded && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <button
            onClick={() => console.log('[Performance] Full metrics:', metrics)}
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '500',
            }}
          >
            Log Details
          </button>
          <button
            onClick={() => {
              if ('performance' in window) {
                console.log(
                  '[Performance] Navigation:',
                  performance.getEntriesByType('navigation')[0]
                )
                console.log('[Performance] Paint:', performance.getEntriesByType('paint'))
                console.log('[Performance] Resources:', performance.getEntriesByType('resource'))
                console.log('[Performance] Memory:', performance.memory)
              }
            }}
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '500',
            }}
          >
            Debug API
          </button>
        </div>
      )}
    </div>
  )
}
