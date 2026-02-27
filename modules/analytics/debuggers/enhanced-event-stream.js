'use client'

import React from 'react'

import { Z_INDEX } from '@/lib/constants'
import { useAnalyticsState } from '@/modules/analytics'

export function EnhancedEventStream() {
  const { sessionState } = useAnalyticsState()
  const [expanded, setExpanded] = React.useState(true)
  const [filter, setFilter] = React.useState('all')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [autoScroll, setAutoScroll] = React.useState(true)
  const eventListRef = React.useRef(null)

  const filteredEvents = React.useMemo(() => {
    let events = sessionState.events

    if (filter !== 'all') {
      events = events.filter((event) => event.name === filter)
    }

    if (searchTerm) {
      events = events.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          JSON.stringify(event.properties).toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return events
  }, [sessionState.events, filter, searchTerm])

  const eventTypes = React.useMemo(() => {
    const types = new Set(sessionState.events.map((e) => e.name))
    return Array.from(types).sort()
  }, [sessionState.events])

  React.useEffect(() => {
    if (autoScroll && eventListRef.current) {
      eventListRef.current.scrollTop = eventListRef.current.scrollHeight
    }
  }, [filteredEvents.length, autoScroll])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    })
  }

  const getEventIcon = (eventName) => {
    const icons = {
      page_view: { icon: '📄', color: '#007acc' },
      click: { icon: '👆', color: '#28a745' },
      input: { icon: '⌨️', color: '#ffc107' },
      change: { icon: '✏️', color: '#fd7e14' },
      focus: { icon: '🎯', color: '#6f42c1' },
      blur: { icon: '👁️', color: '#6c757d' },
      scroll: { icon: '📜', color: '#17a2b8' },
      form_submit: { icon: '📝', color: '#20c997' },
      select: { icon: '📋', color: '#e83e8c' },
      checkbox: { icon: '☑️', color: '#6610f2' },
      radio: { icon: '⭕', color: '#dc3545' },
      switch: { icon: '🔀', color: '#343a40' },
      conversion: { icon: '💰', color: '#28a745' },
      hover: { icon: '🖱️', color: '#fd7e14' },
      double_click: { icon: '👆👆', color: '#007acc' },
      right_click: { icon: '👉', color: '#dc3545' },
    }
    return icons[eventName] || { icon: '📊', color: '#6c757d' }
  }

  const getElementInfo = (properties) => {
    if (!properties) return { type: 'unknown', text: '', container: '' }

    const element = properties.element || 'unknown'
    const text = properties.text || properties.value || ''
    const container = properties.container || properties.parent || ''

    return {
      type: element.charAt(0).toUpperCase() + element.slice(1),
      text:
        text || (properties.checked ? 'Checked' : properties.checked === false ? 'Unchecked' : ''),
      container: container,
    }
  }

  const getEventTypeLabel = (eventName) => {
    const labels = {
      page_view: 'Page View',
      click: 'Click',
      input: 'Input',
      change: 'Change',
      focus: 'Focus',
      blur: 'Blur',
      scroll: 'Scroll',
      form_submit: 'Form Submit',
      select: 'Select',
      checkbox: 'Checkbox',
      radio: 'Radio',
      switch: 'Switch',
      conversion: 'Conversion',
      hover: 'Hover',
      double_click: 'Double Click',
      right_click: 'Right Click',
    }
    return labels[eventName] || eventName
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background:
          'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
        color: 'white',
        padding: '0',
        borderRadius: '12px',
        fontSize: '12px',
        width: expanded ? '450px' : '350px',
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
            🔄 Event Stream
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '500',
              }}
            >
              {filteredEvents.length}
            </span>
          </h4>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
            Real-time user interactions
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              background: autoScroll ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
              color: autoScroll ? '#22c55e' : '#94a3b8',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            {autoScroll ? '📜' : '📄'}
          </button>
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
      </div>

      {/* Controls */}
      {expanded && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <input
            type='text'
            placeholder='Search events...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: '150px',
              background: 'rgba(30, 41, 59, 0.8)',
              color: 'white',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              outline: 'none',
            }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              color: 'white',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              padding: '6px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              outline: 'none',
            }}
          >
            <option value='all'>All Events</option>
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {getEventTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Event List */}
      <div
        ref={eventListRef}
        style={{
          maxHeight: expanded ? '450px' : '100px',
          overflowY: 'auto',
          padding: '8px',
        }}
      >
        {filteredEvents.length === 0 ? (
          <div
            style={{
              color: '#64748b',
              textAlign: 'center',
              padding: '40px 20px',
              fontSize: '11px',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📭</div>
            <div>No events yet</div>
            <div style={{ fontSize: '10px', marginTop: '4px' }}>
              Start interacting with the page
            </div>
          </div>
        ) : (
          filteredEvents
            .slice(-50)
            .reverse()
            .map((event, index) => {
              const eventIcon = getEventIcon(event.name)
              const elementInfo = getElementInfo(event.properties)

              return (
                <div
                  key={index}
                  style={{
                    background: 'rgba(30, 41, 59, 0.4)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px',
                    fontSize: '11px',
                    lineHeight: '1.4',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)'
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.4)'
                    e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.1)'
                  }}
                >
                  {/* Event Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '6px',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>{eventIcon.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <strong
                          style={{
                            color: eventIcon.color,
                            fontSize: '12px',
                          }}
                        >
                          {getEventTypeLabel(event.name)}
                        </strong>
                        {elementInfo.type !== 'unknown' && (
                          <span
                            style={{
                              background: 'rgba(148, 163, 184, 0.2)',
                              color: '#cbd5e1',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                            }}
                          >
                            {elementInfo.type}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          color: '#64748b',
                          fontSize: '9px',
                          marginTop: '1px',
                        }}
                      >
                        {formatTime(event.timestamp)}
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div style={{ marginLeft: '22px' }}>
                    {elementInfo.text && (
                      <div
                        style={{
                          color: '#e2e8f0',
                          marginBottom: '2px',
                          fontSize: '10px',
                        }}
                      >
                        Text:{' '}
                        <span style={{ color: '#94a3b8' }}>&quot;{elementInfo.text}&quot;</span>
                      </div>
                    )}

                    {elementInfo.container && (
                      <div
                        style={{
                          color: '#e2e8f0',
                          marginBottom: '2px',
                          fontSize: '10px',
                        }}
                      >
                        Container: <span style={{ color: '#94a3b8' }}>{elementInfo.container}</span>
                      </div>
                    )}

                    {/* Additional Properties */}
                    {event.properties && Object.keys(event.properties).length > 0 && (
                      <div
                        style={{
                          marginTop: '4px',
                          padding: '4px 6px',
                          background: 'rgba(15, 23, 42, 0.4)',
                          borderRadius: '4px',
                          fontSize: '9px',
                          color: '#94a3b8',
                        }}
                      >
                        {Object.entries(event.properties)
                          .filter(
                            ([key]) => !['element', 'text', 'container', 'parent'].includes(key)
                          )
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key}>
                              {key}: <span style={{ color: '#e2e8f0' }}>{String(value)}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
        )}
      </div>

      {/* Actions */}
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
          onClick={() => console.log('[Event Stream] Full events:', sessionState.events)}
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
          Log All
        </button>
        <button
          onClick={() => {
            const data = JSON.stringify(sessionState.events, null, 2)
            navigator.clipboard.writeText(data)
            alert('Events copied to clipboard!')
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
          Copy JSON
        </button>
        <button
          onClick={() => {
            setFilter('all')
            setSearchTerm('')
          }}
          style={{
            background: 'rgba(148, 163, 184, 0.2)',
            color: '#94a3b8',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            padding: '6px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: '500',
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}
