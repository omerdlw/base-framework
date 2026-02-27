'use client'

const DURATION = {
  FAST: 0.3,
  NORMAL: 0.5,
  SLOW: 0.8,
}

const EASE = {
  SMOOTH: [0.4, 0, 0.2, 1],
  BOUNCE: [0.68, -0.55, 0.265, 1.55],
  EASE_OUT: [0, 0, 0.2, 1],
  EASE_IN: [0.4, 0, 1, 1],
}

const BLUR = {
  LIGHT: 8,
  NORMAL: 12,
  HEAVY: 20,
}

export const TRANSITION_PRESETS = {
  fade: {
    initial: { opacity: 0, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  slideUp: {
    initial: { opacity: 0, y: 40, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -40, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  slideDown: {
    initial: { opacity: 0, y: -40, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 40, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: -40, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  slideRight: {
    initial: { opacity: 0, x: -40, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: 40, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.92, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 1.08, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  scaleDown: {
    initial: { opacity: 0, scale: 1.08, filter: `blur(${BLUR.NORMAL}px)` },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, scale: 0.92, filter: `blur(${BLUR.NORMAL}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  blurFade: {
    initial: { opacity: 0, filter: `blur(${BLUR.HEAVY}px)` },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: `blur(${BLUR.HEAVY}px)` },
    transition: { duration: DURATION.NORMAL, ease: EASE.SMOOTH },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: { duration: 0 },
  },
}

export const DEFAULT_PRESET = 'slideUp'

export function getPreset(presetName) {
  if (!presetName) return TRANSITION_PRESETS[DEFAULT_PRESET]

  if (typeof presetName === 'object') {
    return presetName
  }

  return TRANSITION_PRESETS[presetName] || TRANSITION_PRESETS[DEFAULT_PRESET]
}

export function getBackgroundAnimation(presetName) {
  const preset = getPreset(presetName)
  return {
    initial: preset.initial,
    animate: preset.animate,
    exit: preset.exit,
    transition: preset.transition,
  }
}
