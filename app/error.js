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
    <div className='w-screen h-screen center bg-red-500/5 p-4 text-red-500/70 font-semibold'>
      Bir hata oluştuğu için sayfa yüklenemedi
    </div>
  )
}
