'use client'

import React from 'react'

import { Z_INDEX } from '@/lib/constants'

export function PerformanceMetrics() {
  const [metrics, setMetrics] = React.useState({})
  const [expanded, setExpanded] = React.useState(false)

  React.useEffect(() => {
    const collectMetrics = () => {
      if (typeof window !== 'undefined' && 'performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')

        const newMetrics = {
          domContentLoaded: Math.round(
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          ),
          loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
          firstPaint: paint.find((p) => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint:
            paint.find((p) => p.name === 'first-contentful-paint')?.startTime || 0,

          dnsLookup: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
          tcpConnect: Math.round(navigation.connectEnd - navigation.connectStart),
          serverResponse: Math.round(navigation.responseEnd - navigation.requestStart),

          memoryUsed: performance.memory
            ? Math.round(performance.memory.usedJSHeapSize / 1048576)
            : 0,
          memoryTotal: performance.memory
            ? Math.round(performance.memory.totalJSHeapSize / 1048576)
            : 0,
        }

        setMetrics(newMetrics)
      }
    }

    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
      return () => window.removeEventListener('load', collectMetrics)
    }
  }, [])

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return '#28a745'
    if (value <= thresholds.warning) return '#ffc107'
    return '#dc3545'
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const metricDefinitions = [
    {
      key: 'domContentLoaded',
      label: 'DOM Content Loaded',
      thresholds: { good: 500, warning: 1500 },
      unit: 'time',
    },
    {
      key: 'loadComplete',
      label: 'Load Complete',
      thresholds: { good: 1000, warning: 3000 },
      unit: 'time',
    },
    {
      key: 'firstPaint',
      label: 'First Paint',
      thresholds: { good: 1000, warning: 2000 },
      unit: 'time',
    },
    {
      key: 'firstContentfulPaint',
      label: 'First Contentful Paint',
      thresholds: { good: 1500, warning: 2500 },
      unit: 'time',
    },
    {
      key: 'dnsLookup',
      label: 'DNS Lookup',
      thresholds: { good: 100, warning: 500 },
      unit: 'time',
    },
    {
      key: 'tcpConnect',
      label: 'TCP Connect',
      thresholds: { good: 100, warning: 500 },
      unit: 'time',
    },
    {
      key: 'serverResponse',
      label: 'Server Response',
      thresholds: { good: 200, warning: 1000 },
      unit: 'time',
    },
    {
      key: 'memoryUsed',
      label: 'Memory Used',
      thresholds: { good: 50, warning: 100 },
      unit: 'memory',
    },
  ]

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.95)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '350px',
        maxHeight: expanded ? '600px' : '200px',
        overflow: 'hidden',
        zIndex: Z_INDEX.DEBUG_OVERLAY,
        border: '2px solid #28a745',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <h4 style={{ margin: 0, color: '#28a745' }}>⚡ Performance Metrics</h4>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#28a745',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Quick Summary */}
      {!expanded && (
        <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
          <div style={{ marginBottom: '5px' }}>
            Load:{' '}
            <span
              style={{
                color: getStatusColor(metrics.loadComplete || 0, { good: 1000, warning: 3000 }),
              }}
            >
              {formatTime(metrics.loadComplete || 0)}
            </span>
          </div>
          <div style={{ marginBottom: '5px' }}>
            Memory:{' '}
            <span
              style={{
                color: getStatusColor(metrics.memoryUsed || 0, { good: 50, warning: 100 }),
              }}
            >
              {metrics.memoryUsed || 0}MB
            </span>
          </div>
          <div>
            FCP:{' '}
            <span
              style={{
                color: getStatusColor(metrics.firstContentfulPaint || 0, {
                  good: 1500,
                  warning: 2500,
                }),
              }}
            >
              {formatTime(metrics.firstContentfulPaint || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {expanded && (
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #333',
            borderRadius: '4px',
            padding: '10px',
          }}
        >
          {metricDefinitions.map((metric) => {
            const value = metrics[metric.key] || 0
            const color = getStatusColor(value, metric.thresholds)

            return (
              <div
                key={metric.key}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid #333',
                }}
              >
                <div style={{ fontSize: '11px' }}>
                  <div>{metric.label}</div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: '#888',
                      marginTop: '2px',
                    }}
                  >
                    Good: ≤{metric.thresholds.good}ms, Warning: ≤{metric.thresholds.warning}ms
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: color,
                    textAlign: 'right',
                  }}
                >
                  {metric.unit === 'memory' ? `${value}MB` : formatTime(value)}
                  <div
                    style={{
                      fontSize: '8px',
                      marginTop: '2px',
                    }}
                  >
                    {value <= metric.thresholds.good
                      ? '✅'
                      : value <= metric.thresholds.warning
                        ? '⚠️'
                        : '❌'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      {expanded && (
        <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
          <button
            onClick={() => console.log('[Performance] Full metrics:', metrics)}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px',
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
                console.log('[Performance] Memory:', performance.memory)
              }
            }}
            style={{
              background: '#007acc',
              color: 'white',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px',
            }}
          >
            Debug API
          </button>
        </div>
      )}
    </div>
  )
}
