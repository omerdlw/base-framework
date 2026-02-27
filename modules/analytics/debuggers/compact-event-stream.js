'use client'

import React from 'react'

import { useAnalyticsState } from '@/modules/analytics'

export function CompactEventStream() {
  const { sessionState } = useAnalyticsState()
  const [expanded, setExpanded] = React.useState(false)
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
      eventListRef.current.scrollTop = 0
    }
  }, [filteredEvents.length, autoScroll])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const getEventIcon = (eventName) => {
    const icons = {
      page_view: { icon: '📄', color: 'text-blue-400' },
      click: { icon: '👆', color: 'text-green-400' },
      input: { icon: '⌨️', color: 'text-yellow-400' },
      change: { icon: '✏️', color: 'text-orange-400' },
      focus: { icon: '🎯', color: 'text-purple-400' },
      blur: { icon: '👁️', color: 'text-gray-400' },
      scroll: { icon: '📜', color: 'text-cyan-400' },
      form_submit: { icon: '📝', color: 'text-teal-400' },
      select: { icon: '📋', color: 'text-pink-400' },
      checkbox: { icon: '☑️', color: 'text-indigo-400' },
      radio: { icon: '⭕', color: 'text-red-400' },
      switch: { icon: '🔀', color: 'text-gray-600' },
      conversion: { icon: '💰', color: 'text-green-400' },
      hover: { icon: '🖱️', color: 'text-orange-400' },
      double_click: { icon: '👆👆', color: 'text-blue-400' },
      right_click: { icon: '👉', color: 'text-red-400' },
    }
    return icons[eventName] || { icon: '📊', color: 'text-gray-400' }
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
    <div className='fixed top-4 left-4 z-50 max-w-sm rounded-lg border border-slate-700/50 bg-slate-900/95 shadow-2xl backdrop-blur-sm'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-slate-700/50 bg-slate-800/80 px-3 py-2'>
        <div className='flex items-center gap-2'>
          <h4 className='flex items-center gap-1 text-sm font-semibold text-white'>
            🔄 Events
            <span className='rounded-full bg-blue-500/20 px-1.5 py-0.5 text-xs text-blue-400'>
              {filteredEvents.length}
            </span>
          </h4>
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`rounded p-1 text-xs ${autoScroll ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}
            title={autoScroll ? 'Auto-scroll enabled' : 'Auto-scroll disabled'}
          >
            {autoScroll ? '📜' : '📄'}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className='rounded bg-blue-500/20 p-1 text-xs text-blue-400'
          >
            {expanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Collapsed State */}
      {!expanded && (
        <div className='space-y-1 px-3 py-2 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Latest:</span>
            <span className='text-slate-200'>
              {filteredEvents.length > 0
                ? getEventTypeLabel(filteredEvents[filteredEvents.length - 1].name)
                : 'None'}
            </span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-slate-400'>Total:</span>
            <span className='text-slate-200'>{filteredEvents.length}</span>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {expanded && (
        <>
          {/* Controls */}
          <div className='flex gap-2 border-b border-slate-700/50 px-3 py-2'>
            <input
              type='text'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='flex-1 rounded border border-slate-600/50 bg-slate-800/50 px-2 py-1 text-xs text-white outline-none focus:border-blue-500/50'
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className='rounded border border-slate-600/50 bg-slate-800/50 px-2 py-1 text-xs text-white outline-none focus:border-blue-500/50'
            >
              <option value='all'>All</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {getEventTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Event List */}
          <div ref={eventListRef} className='max-h-64 space-y-1 overflow-y-auto p-2'>
            {filteredEvents.length === 0 ? (
              <div className='py-8 text-center text-xs text-slate-500'>
                <div className='mb-2 text-2xl'>📭</div>
                <div>No events</div>
              </div>
            ) : (
              filteredEvents
                .slice(-20)
                .reverse()
                .map((event, index) => {
                  const eventIcon = getEventIcon(event.name)
                  const elementInfo = getElementInfo(event.properties)

                  return (
                    <div
                      key={index}
                      className='rounded border border-slate-700/30 bg-slate-800/40 p-2 text-xs transition-all duration-200 hover:border-slate-700/50 hover:bg-slate-800/60'
                    >
                      <div className='mb-1 flex items-start gap-2'>
                        <span className='text-sm'>{eventIcon.icon}</span>
                        <div className='min-w-0 flex-1'>
                          <div className='flex flex-wrap items-center gap-1.5'>
                            <span className={`font-medium ${eventIcon.color}`}>
                              {getEventTypeLabel(event.name)}
                            </span>
                            {elementInfo.type !== 'unknown' && (
                              <span className='rounded bg-slate-700/50 px-1 py-0.5 text-[10px] text-slate-300'>
                                {elementInfo.type}
                              </span>
                            )}
                          </div>
                          <div className='mt-0.5 text-[10px] text-slate-500'>
                            {formatTime(event.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className='ml-6 space-y-0.5'>
                        {elementInfo.text && (
                          <div className='text-[10px] text-slate-300'>
                            Text:{' '}
                            <span className='text-slate-400'>&quot;{elementInfo.text}&quot;</span>
                          </div>
                        )}

                        {elementInfo.container && (
                          <div className='text-[10px] text-slate-300'>
                            Container:{' '}
                            <span className='text-slate-400'>{elementInfo.container}</span>
                          </div>
                        )}

                        {event.properties && Object.keys(event.properties).length > 0 && (
                          <div className='mt-1 rounded bg-slate-900/40 p-1.5 text-[10px] text-slate-400'>
                            {Object.entries(event.properties)
                              .filter(
                                ([key]) =>
                                  ![
                                    'element',
                                    'text',
                                    'container',
                                    'parent',
                                    'className',
                                    'value',
                                  ].includes(key)
                              )
                              .slice(0, 2)
                              .map(([key, value]) => (
                                <div key={key}>
                                  {key}: <span className='text-slate-300'>{String(value)}</span>
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
          <div className='flex gap-1.5 border-t border-slate-700/50 bg-slate-800/80 px-3 py-2'>
            <button
              onClick={() => console.log('[Event Stream] Full events:', sessionState.events)}
              className='rounded border border-blue-500/30 bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-400'
            >
              Log
            </button>
            <button
              onClick={() => {
                const data = JSON.stringify(sessionState.events, null, 2)
                navigator.clipboard.writeText(data)
                alert('Events copied!')
              }}
              className='rounded border border-green-500/30 bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400'
            >
              Copy
            </button>
            <button
              onClick={() => {
                setFilter('all')
                setSearchTerm('')
              }}
              className='rounded border border-slate-600/30 bg-slate-700/50 px-2 py-1 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-700/70'
            >
              Clear
            </button>
          </div>
        </>
      )}
    </div>
  )
}
