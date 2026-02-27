'use client'

import { useEffect, useRef } from 'react'

import { AnimatePresence, motion } from 'framer-motion'

import { DURATION, EASING, Z_INDEX } from '@/lib/constants'

import { useCountdownActions, useCountdownState } from './context'

export { CountdownProvider, useCountdownState, useCountdownActions } from './context'

function VideoBackground({
  videoSrc,
  noiseSrc,
  videoCorp,
  videoWidth,
  isPlaying,
  onPlayStateChange,
}) {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.play().catch((e) => console.warn('Video play failed:', e))
    } else {
      video.pause()
    }
  }, [isPlaying])

  const handleEnded = () => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    onPlayStateChange(false)
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video && video.duration && videoCorp) {
      if (video.currentTime >= video.duration - videoCorp) {
        handleEnded()
      }
    }
  }

  return (
    <>
      <div className='fixed inset-0 flex h-screen w-screen items-center overflow-hidden'>
        <video
          className={`mx-auto h-screen ${videoWidth} shrink-0 object-cover scale-125 grayscale-25`}
          onPause={() => onPlayStateChange(false)}
          onPlay={() => onPlayStateChange(true)}
          onEnded={handleEnded}
          onTimeUpdate={handleTimeUpdate}
          ref={videoRef}
          playsInline
        >
          <source src={videoSrc} type='video/mp4' />
        </video>
      </div>
      <div
        style={{ backgroundImage: `url(${noiseSrc})` }}
        className='fixed inset-0 h-screen w-screen bg-cover bg-center opacity-70 mix-blend-overlay'
      />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-r from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-r from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-r from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-r from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-l from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-l from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-l from-black via-transparent to-transparent' />
      <div className='fixed inset-0 h-screen w-screen bg-linear-to-l from-black via-transparent to-transparent' />
    </>
  )
}


export function CountdownOverlay() {
  const { isEnabled, isPlaying, config } = useCountdownState()
  const { setIsPlaying } = useCountdownActions()

  return (
    <AnimatePresence>
      {isEnabled && (
        <motion.div
          transition={{ duration: DURATION.NORMAL, ease: EASING.EASE_IN_OUT }}
          className='fixed inset-0 h-screen w-screen bg-black'
          style={{ zIndex: Z_INDEX.COUNTDOWN }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          <VideoBackground
            videoSrc={config.videoSrc}
            noiseSrc={config.noiseSrc}
            videoCorp={config.videoCorp}
            videoWidth={config.videoWidth}
            isPlaying={isPlaying}
            onPlayStateChange={setIsPlaying}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
