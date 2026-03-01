'use client'

import { useCallback, useEffect, useState, useRef } from 'react'

import { usePathname } from 'next/navigation'

import { Wifi, WifiOff } from 'lucide-react'

import { EVENT_TYPES, globalEvents } from '@/lib/events'
import { HEX_TO_RGBA } from '@/lib/utils/index'
import { Button } from '@/ui/elements/index'

const ERROR_PRIORITY = {
  APP_ERROR: 100,
  API_ERROR: 95,
  OFFLINE: 90,
  ONLINE: 10,
}

export const useNavigationError = () => {
  const [errorState, setErrorState] = useState(null)
  const pathname = usePathname()

  const apiErrorQueue = useRef([])
  const batchTimeout = useRef(null)

  const updateErrorWithPriority = useCallback((newState) => {
    setErrorState((prev) => {
      if (!newState) return null
      if (!prev) return newState
      const prevPriority = ERROR_PRIORITY[prev.type] ?? 0
      const newPriority = ERROR_PRIORITY[newState.type] ?? 0
      if (newPriority < prevPriority) return prev
      return newState
    })
  }, [])

  useEffect(() => {
    setErrorState((prev) => {
      if (prev?.type === 'APP_ERROR' || prev?.type === 'API_ERROR') {
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
          setTimeout(() => window.dispatchEvent(new Event('offline')), 0)
        }
        return null
      }
      return prev
    })
  }, [pathname])

  useEffect(() => {
    const unsubscribeApiError = globalEvents.subscribe(EVENT_TYPES.API_ERROR, (eventData) => {
      const { status, message, isCritical, retry } = eventData || {}

      if (!isCritical) return

      apiErrorQueue.current.push({ status, message, retry })

      if (batchTimeout.current) {
        clearTimeout(batchTimeout.current)
      }

      batchTimeout.current = setTimeout(() => {
        const errors = [...apiErrorQueue.current]
        apiErrorQueue.current = []

        const isBatch = errors.length > 1

        const title = isBatch ? 'Çoklu API Hatası' : `API Hatası (${errors[0].status || 'Ağ'})`
        const description = isBatch ? `${errors.length} farklı istek başarısız oldu.` : errors[0].message || 'İstek sırasında bir hata oluştu.'

        const handleRetry = () => {
          setErrorState(null)
          errors.forEach(err => {
            if (err.retry) err.retry()
          })
        }

        const ActionComponent = () => (
          <div className='mt-2.5 flex items-center gap-2'>
            <Button
              className='center bg-error/20 text-error hover:bg-error/30 w-full cursor-pointer rounded-[20px] px-4 py-2 text-sm transition-colors'
              onClick={(e) => {
                e.stopPropagation()
                handleRetry()
              }}
            >
              Tekrar Dene
            </Button>
            <Button
              className='center bg-error/20 text-error hover:bg-error/30 w-full cursor-pointer rounded-[20px] px-4 py-2 text-sm transition-colors'
              onClick={(e) => {
                e.stopPropagation()
                window.location.reload()
              }}
            >
              Yenile
            </Button>
          </div>
        )

        updateErrorWithPriority({
          type: 'API_ERROR',
          isError: true,
          title,
          description,
          icon: 'solar:danger-triangle-bold',
          style: {
            card: {
              background: `linear-gradient(125deg, ${HEX_TO_RGBA('var(--color-error)', 0.2)}, rgba(0,0,0,0.5))`,
              borderColor: HEX_TO_RGBA('var(--color-error)', 0.4),
            },
            icon: {
              background: HEX_TO_RGBA('var(--color-error)', 0.4),
              color: '#ffffff',
            },
            shortcutBadge: {
              background: HEX_TO_RGBA('var(--color-error)', 0.2),
              borderColor: HEX_TO_RGBA('var(--color-error)', 0.3),
              color: '#ffffff',
              opacity: 1,
            },
          },
          action: ActionComponent,
          hideSettings: true,
          hideScroll: true,
        })
      }, 300)
    })

    const unsubscribeAppError = globalEvents.subscribe(EVENT_TYPES.APP_ERROR, (eventData) => {
      const { message, resetError } = eventData || {}

      const ActionComponent = () => (
        <div className='mt-2.5 flex items-center gap-2'>
          {resetError && (
            <Button
              className='center bg-error/20 text-error hover:bg-error/30 w-full cursor-pointer rounded-[20px] px-4 py-2 text-sm transition-colors'
              onClick={(e) => {
                e.stopPropagation()
                setErrorState(null)
                resetError()
                if (typeof navigator !== 'undefined' && !navigator.onLine) {
                  setTimeout(() => window.dispatchEvent(new Event('offline')), 0)
                }
              }}
            >
              Tekrar Dene
            </Button>
          )}
          <Button
            className='center bg-error/20 text-error hover:bg-error/30 w-full cursor-pointer rounded-[20px] px-4 py-2 text-sm transition-colors'
            onClick={(e) => {
              e.stopPropagation()
              window.location.reload()
            }}
          >
            Yenile
          </Button>
        </div>
      )

      updateErrorWithPriority({
        type: 'APP_ERROR',
        isError: true,
        title: 'Bileşen Hatası',
        description: message || 'Beklenmeyen bir hata oluştu.',
        icon: 'solar:danger-triangle-bold',
        style: {
          card: {
            background: `linear-gradient(125deg, ${HEX_TO_RGBA('var(--color-error)', 0.2)}, rgba(0,0,0,0.5))`,
            borderColor: HEX_TO_RGBA('var(--color-error)', 0.4),
          },
          icon: {
            background: HEX_TO_RGBA('var(--color-error)', 0.4),
            color: '#ffffff',
          },
          shortcutBadge: {
            background: HEX_TO_RGBA('var(--color-error)', 0.2),
            borderColor: HEX_TO_RGBA('var(--color-error)', 0.3),
            color: '#ffffff',
            opacity: 1,
          },
        },
        action: ActionComponent,
        hideSettings: true,
        hideScroll: true,
      })
    })

    const handleOffline = () => {
      updateErrorWithPriority({
        type: 'OFFLINE',
        isError: true,
        title: 'Bağlantı Koptu',
        description: 'İnternet bağlantınız kesildi.',
        icon: <WifiOff size={24} />,
        style: {
          card: {
            background: `linear-gradient(125deg, ${HEX_TO_RGBA('var(--color-warning)', 0.2)}, rgba(0,0,0,0.5))`,
            borderColor: HEX_TO_RGBA('var(--color-warning)', 0.4),
          },
          icon: {
            background: HEX_TO_RGBA('var(--color-warning)', 0.4),
            color: '#ffffff',
          },
          shortcutBadge: {
            background: HEX_TO_RGBA('var(--color-warning)', 0.2),
            borderColor: HEX_TO_RGBA('var(--color-warning)', 0.3),
            color: '#ffffff',
            opacity: 1,
          },
        },
        action: null,
        hideSettings: true,
        hideScroll: true,
      })
    }

    const handleOnline = () => {
      setErrorState((prev) => {
        if (prev?.type === 'OFFLINE') {
          setTimeout(() => {
            setErrorState((current) => (current?.type === 'ONLINE' ? null : current))
          }, 3000)

          return {
            type: 'ONLINE',
            isError: false,
            title: 'Tekrar bağlanıldı',
            description: 'İnternete bağlandınız',
            icon: <Wifi size={24} />,
            style: {
              card: {
                background: `linear-gradient(125deg, ${HEX_TO_RGBA('var(--color-success)', 0.2)}, rgba(0,0,0,0.5))`,
                borderColor: HEX_TO_RGBA('var(--color-success)', 0.4),
              },
              icon: {
                background: HEX_TO_RGBA('var(--color-success)', 0.4),
                color: '#ffffff',
              },
              shortcutBadge: {
                background: HEX_TO_RGBA('var(--color-success)', 0.2),
                borderColor: HEX_TO_RGBA('var(--color-success)', 0.3),
                color: '#ffffff',
                opacity: 1,
              },
            },
            action: null,
            hideSettings: true,
            hideScroll: true,
          }
        }
        return null
      })
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      handleOffline()
    }

    return () => {
      unsubscribeAppError()
      unsubscribeApiError()
      if (batchTimeout.current) clearTimeout(batchTimeout.current)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [updateErrorWithPriority])

  return errorState
}
