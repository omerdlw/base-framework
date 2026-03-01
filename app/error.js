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
    <div className='flex h-full w-full flex-col items-center justify-center p-4'>
      <div className='rounded-lg bg-red-500/10 px-6 py-4 text-center text-red-500/80 backdrop-blur-sm'>
        <p className='text-lg font-medium'>Bir hata oluştuğu için sayfa yüklenemedi</p>
      </div>
    </div>
  )
}
