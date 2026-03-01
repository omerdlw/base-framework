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
        <div className='flex h-full w-full flex-col items-center justify-center p-4'>
          <div className='rounded-lg bg-red-500/10 px-6 py-4 text-center text-red-500/80 backdrop-blur-sm'>
            <p className='text-lg font-medium'>
              Kritik bir uygulama hatası oluştu. Lütfen sayfayı yenileyin.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
