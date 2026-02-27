import { DURATION } from '@/lib/constants'

import { ANIMATION_CONFIGS, MODAL_POSITIONS } from './config'

const baseExitTransition = { duration: DURATION.NORMAL, ease: 'easeIn' }
const springTransition = ANIMATION_CONFIGS.SPRING
const smoothTransition = ANIMATION_CONFIGS.SMOOTH

export const getModalVariants = (position) => {
  const variants = {
    [MODAL_POSITIONS.CENTER]: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: {
        scale: 1,
        opacity: 1,
        transition: springTransition,
      },
      exit: {
        scale: 0.9,
        opacity: 0,
        transition: baseExitTransition,
      },
    },
    [MODAL_POSITIONS.TOP]: {
      hidden: { y: '-100%', opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: smoothTransition,
      },
      exit: {
        y: '-100%',
        opacity: 0,
        transition: baseExitTransition,
      },
    },
    [MODAL_POSITIONS.BOTTOM]: {
      hidden: { y: '100%', opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: smoothTransition,
      },
      exit: {
        y: '100%',
        opacity: 0,
        transition: baseExitTransition,
      },
    },
    [MODAL_POSITIONS.LEFT]: {
      hidden: { x: '-100%', opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: smoothTransition,
      },
      exit: {
        x: '-100%',
        opacity: 0,
        transition: baseExitTransition,
      },
    },
    [MODAL_POSITIONS.RIGHT]: {
      hidden: { x: '100%', opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: smoothTransition,
      },
      exit: {
        x: '100%',
        opacity: 0,
        transition: baseExitTransition,
      },
    },
    [MODAL_POSITIONS.TOP_LEFT]: {
      hidden: { x: '-100%', y: '-100%', opacity: 0 },
      visible: { x: 0, y: 0, opacity: 1, transition: smoothTransition },
      exit: { x: '-100%', y: '-100%', opacity: 0, transition: baseExitTransition },
    },
    [MODAL_POSITIONS.TOP_RIGHT]: {
      hidden: { x: '100%', y: '-100%', opacity: 0 },
      visible: { x: 0, y: 0, opacity: 1, transition: smoothTransition },
      exit: { x: '100%', y: '-100%', opacity: 0, transition: baseExitTransition },
    },
    [MODAL_POSITIONS.BOTTOM_LEFT]: {
      hidden: { x: '-100%', y: '100%', opacity: 0 },
      visible: { x: 0, y: 0, opacity: 1, transition: smoothTransition },
      exit: { x: '-100%', y: '100%', opacity: 0, transition: baseExitTransition },
    },
    [MODAL_POSITIONS.BOTTOM_RIGHT]: {
      hidden: { x: '100%', y: '100%', opacity: 0 },
      visible: { x: 0, y: 0, opacity: 1, transition: smoothTransition },
      exit: { x: '100%', y: '100%', opacity: 0, transition: baseExitTransition },
    },
  }

  return variants[position] || variants[MODAL_POSITIONS.CENTER]
}

export const POSITION_CLASSES = {
  [MODAL_POSITIONS.CENTER]: 'items-center justify-center',
  [MODAL_POSITIONS.TOP]: 'items-center justify-start',
  [MODAL_POSITIONS.BOTTOM]: 'items-center justify-end',
  [MODAL_POSITIONS.LEFT]: 'items-start justify-center',
  [MODAL_POSITIONS.RIGHT]: 'items-end justify-center',
  [MODAL_POSITIONS.TOP_LEFT]: 'items-start justify-start',
  [MODAL_POSITIONS.TOP_RIGHT]: 'items-end justify-start',
  [MODAL_POSITIONS.BOTTOM_LEFT]: 'items-start justify-end',
  [MODAL_POSITIONS.BOTTOM_RIGHT]: 'items-end justify-end',
}

export const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.FAST } },
}
