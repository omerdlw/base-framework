'use client'

import { useEffect } from 'react'

import { EVENT_TYPES, globalEvents } from '@/lib/events'
import { getErrorReporter } from '@/modules/error-boundary/reporter'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    getErrorReporter().captureError(error, {
      source: 'Nextjs-App-Global-Error-File',
    })

    globalEvents.emit(EVENT_TYPES.APP_ERROR, {
      message: error?.message || 'Kritik uygulama hatası.',
      error,
      resetError: reset,
    })
  }, [error, reset])

  return (
    <html>
      <body>
        <div className='flex h-screen w-full items-center justify-center bg-zinc-950 text-sm font-medium text-red-500/70'>
          Kritik bir uygulama hatası oluştu. Lütfen sayfayı yenileyin.
        </div>
      </body>
    </html>
  )
}
