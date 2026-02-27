'use client'

import { useRegistry } from '@/lib/hooks'
import { useToast } from '@/modules/notification/hooks'
import { Transition } from '@/modules/transition'

export default function Page() {
  useRegistry({
    background: {
      transitionPreset: 'slideUp',
      opacity: 0.6,
    },
    notifications: {
      onMount: {
        type: 'welcome-back',
        title: 'Harika!',
        message: 'Sizi yeniden aramızda görmek çok güzel.',
        icon: 'solar:hand-heart-bold',
        colorClass: 'text-pink-500 bg-pink-500/10',
        duration: 1000,
      },
    },
  })

  return (
    <>
      <Transition></Transition>
    </>
  )
}
