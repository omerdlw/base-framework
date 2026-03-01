'use client'

import { useRegistry } from '@/lib/hooks'

import { useCountdownState } from './context'

export { CountdownProvider, useCountdownState, useCountdownActions } from './context'

export function CountdownOverlay() {
  const { isEnabled, config } = useCountdownState()

  useRegistry(
    isEnabled
      ? {
          background: {
            video: config.videoSrc,
            videoOptions: {
              corp: config.videoCorp,
              autoplay: false,
              muted: false,
              loop: true,
            },
            videoStyle: {
              width: config.videoWidth,
              height: '100%',
              scale: 1.12,
              margin: 'auto',
              filter: 'grayscale(100%) contrast(90%)',
              leftGradient: 3,
              rightGradient: 3,
              opacity: 1,
            },
            noiseStyle: {
              opacity: 0.6,
            },
          },
        }
      : {}
  )

  return null
}
