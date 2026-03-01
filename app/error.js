'use client'

import { useEffect } from 'react'

import { EVENT_TYPES, globalEvents } from '@/lib/events'
import { getErrorReporter } from '@/modules/error-boundary/reporter'

export default function Error({ error, reset }) {
  useEffect(() => {
    getErrorReporter().captureError(error, {
      source: 'Nextjs-App-Error-File',
    })

    globalEvents.emit(EVENT_TYPES.APP_ERROR, {
      message: error?.message || 'Sayfa düzeyinde bir hata oluştu.',
      error,
      resetError: reset,
    })
  }, [error, reset])

  return (
    <div className='center h-screen w-screen bg-red-500/5 p-4 font-semibold text-red-500/70'>
      Bir hata oluştuğu için sayfa yüklenemedi
    </div>
  )
}
