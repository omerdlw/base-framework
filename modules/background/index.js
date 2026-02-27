'use client'

import { useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { DURATION, EASING, Z_INDEX } from '@/lib/constants'

import { useTransitionState } from '../transition/context'
import { useBackgroundActions, useBackgroundState } from './context'

export { useBackgroundState, BackgroundProvider } from './context'

export function BackgroundOverlay() {
  const {
    overlayOpacity,
    hasBackground,
    videoOptions,
    position,
    overlay,
    isVideo,
    image,
    video,
    blur,
    isPlaying,
  } = useBackgroundState()
  const { setVideoPlaying } = useBackgroundActions()

  const { backgroundAnimation } = useTransitionState()

  const videoRef = useRef(null)

  const isMuted = videoOptions?.muted ?? true
  const shouldAutoPlay = videoOptions?.autoplay ?? true
  const isLoop = videoOptions?.loop ?? true
  const playbackRate = videoOptions?.playbackRate ?? 1

  const backgroundKey = isVideo ? video : image

  const motionTransition = backgroundAnimation?.transition ?? {
    duration: DURATION.SLOW,
    ease: EASING.EASE_IN_OUT,
  }
  const motionInitial = backgroundAnimation?.initial ?? { opacity: 0 }
  const motionAnimate = backgroundAnimation?.animate ?? { opacity: 1 }
  const motionExit = backgroundAnimation?.exit ?? { opacity: 0 }

  useEffect(() => {
    if (!isVideo || !videoRef.current) return

    const videoEl = videoRef.current
    videoEl.playbackRate = playbackRate

    if (isMuted) {
      if (shouldAutoPlay) {
        videoEl.muted = true
        videoEl.play().catch((e) => console.warn('Autoplay prevented:', e))
        if (!isPlaying) setVideoPlaying(true)
      }
    } else {
      videoEl.muted = false
      if (isPlaying) {
        videoEl.play().catch((e) => {
          console.warn('Play failed:', e)
          setVideoPlaying(false)
        })
      } else {
        videoEl.pause()
      }
    }
  }, [isVideo, video, isMuted, shouldAutoPlay, playbackRate, isPlaying, setVideoPlaying])

  return (
    <AnimatePresence mode='wait'>
      {hasBackground && (
        <motion.div
          key={backgroundKey}
          initial={motionInitial}
          animate={{
            ...motionAnimate,
            transition: motionTransition,
          }}
          exit={{
            ...motionExit,
            transition: {
              ...motionTransition,
              duration: (motionTransition?.duration ?? 0.5) * 0.6,
            },
          }}
          className='pointer-events-none fixed inset-0'
          style={{ zIndex: Z_INDEX.BACKGROUND }}
        >
          {isVideo ? (
            <video
              ref={videoRef}
              className='absolute inset-0 h-full w-full object-cover'
              muted={isMuted}
              loop={isLoop}
              style={{
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
                transform: blur > 0 ? 'scale(1.1)' : undefined,
              }}
              playsInline
              onLoadedData={() => {
                const videoEl = videoRef.current
                if (!videoEl) return

                videoEl.playbackRate = playbackRate

                if (isMuted && shouldAutoPlay) {
                  videoEl.muted = true
                  videoEl
                    .play()
                    .then(() => setVideoPlaying(true))
                    .catch((e) => console.warn('Autoplay prevented on load:', e))
                }
              }}
            >
              <source src={video} type='video/mp4' />
              <source src={video} type='video/webm' />
            </video>
          ) : (
            <div
              className='absolute inset-0 bg-cover bg-no-repeat'
              style={{
                filter: blur > 0 ? `blur(${blur}px)` : undefined,
                transform: blur > 0 ? 'scale(1.1)' : undefined,
                backgroundImage: `url(${image})`,
                backgroundPosition: position,
              }}
            />
          )}

          {overlay && (
            <div style={{ opacity: overlayOpacity }} className='absolute inset-0 bg-black' />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
