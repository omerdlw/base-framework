'use client'

import React from 'react'

export function AnalyticsDebugger() {
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-ECQ26RC58S', {
        debug_mode: true,
        send_page_view: false,
      })

      console.log('[Analytics] Debug mode forced for reporting')
    }
  }, [])

  return null
}
