'use client'

import React from 'react'

import { Z_INDEX } from '@/lib/constants'
import { useAnalyticsState } from '@/modules/analytics'

export function EventStreamWidget() {
  const { sessionState } = useAnalyticsState()
  const [expanded, setExpanded] = React.useState(false)
  const [filter, setFilter] = React.useState('all')

  const filteredEvents = React.useMemo(() => {
    if (filter === 'all') return sessionState.events
    return sessionState.events.filter((event) => event.name === filter)
  }, [sessionState.events, filter])

  const eventTypes = React.useMemo(() => {
    const types = new Set(sessionState.events.map((e) => e.name))
    return Array.from(types)
  }, [sessionState.events])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getEventIcon = (eventName) => {
    const icons = {
      page_view: '📄',
      click: '👆',
      scroll: '📜',
      form_submit: '📝',
      conversion: '💰',
    }
    return icons[eventName] || '📊'
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0,0,0,0.95)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        maxWidth: '400px',
        maxHeight: expanded ? '600px' : '200px',
        overflow: 'hidden',
        zIndex: Z_INDEX.DEBUG_OVERLAY,
        border: '2px solid #007acc',
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
        <h4 style={{ margin: 0, color: '#007acc' }}>🔄 Event Stream ({filteredEvents.length})</h4>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            background: 'none',
            border: 'none',
            color: '#007acc',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '10px' }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            background: '#333',
            color: 'white',
            border: '1px solid #555',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            width: '100%',
          }}
        >
          <option value='all'>All Events</option>
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Event List */}
      <div
        style={{
          maxHeight: expanded ? '400px' : '100px',
          overflowY: 'auto',
          border: '1px solid #333',
          borderRadius: '4px',
          padding: '5px',
        }}
      >
        {filteredEvents.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No events yet</div>
        ) : (
          filteredEvents
            .slice(-10)
            .reverse()
            .map((event, index) => (
              <div
                key={index}
                style={{
                  padding: '8px',
                  borderBottom: '1px solid #333',
                  fontSize: '11px',
                  lineHeight: '1.4',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ marginRight: '8px' }}>{getEventIcon(event.name)}</span>
                  <strong>{event.name}</strong>
                  <span style={{ marginLeft: 'auto', color: '#888' }}>
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                {event.properties && Object.keys(event.properties).length > 0 && (
                  <div style={{ marginLeft: '20px', color: '#ccc' }}>
                    {Object.entries(event.properties)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <div key={key}>
                          {key}: {String(value)}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {/* Actions */}
      <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
        <button
          onClick={() => console.log('[Event Stream] Full events:', sessionState.events)}
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
          Log All
        </button>
        <button
          onClick={() => {
            const data = JSON.stringify(sessionState.events, null, 2)
            navigator.clipboard.writeText(data)
            alert('Events copied to clipboard!')
          }}
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
          Copy
        </button>
      </div>
    </div>
  )
}
