'use client'

import { useEffect, useState } from 'react'

import { navEvents } from '../events'

export function useNavBadge(navKey, initialBadge) {
  const [badge, setBadge] = useState({
    visible: !!initialBadge,
    value: initialBadge,
    color: 'bg-primary',
  })

  useEffect(() => {
    const unsubscribe = navEvents.onBadgeUpdate((data) => {
      if (data.key === navKey) {
        setBadge({
          visible: data.value !== undefined && data.value !== null && data.value !== '',
          color: data.color || 'bg-primary',
          value: data.value,
        })
      }
    })
    return () => unsubscribe()
  }, [navKey])

  return badge
}
