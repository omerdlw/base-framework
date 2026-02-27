'use client'

import { DURATION } from '@/lib/constants'
import { CN } from '@/lib/utils'

const DEFAULT_DIMENSIONS = {
  collapsedY: -8,
  expandedY: -78,
  cardHeight: 74,
  actionGap: 10,
}

export const ANIMATION = {
  collapsed: { offsetY: DEFAULT_DIMENSIONS.collapsedY, scale: 0.9 },
  expanded: { offsetY: DEFAULT_DIMENSIONS.expandedY, scale: 1 },
  BASE_CARD_HEIGHT: DEFAULT_DIMENSIONS.cardHeight,
  ACTION_GAP: DEFAULT_DIMENSIONS.actionGap,
  transition: {
    ease: [0.23, 1, 0.32, 1],
    duration: 0.45,
    type: 'tween',
  },
}

export const getNavCardProps = (expanded, position, showBorder, cardStyle, cardScale) => {
  const { offsetY: expandedOffsetY } = ANIMATION.expanded
  const { offsetY: collapsedOffsetY, scale: collapsedScale } = ANIMATION.collapsed
  const safeCardStyle = cardStyle
    ? Object.fromEntries(Object.entries(cardStyle).filter(([key]) => key !== 'scale'))
    : {}

  const cardDelay = expanded ? position * 0.02 : 0

  return {
    className: CN(
      'rounded-[30px] border-white/10 absolute left-1/2 h-auto w-full -translate-x-1/2 transform-gpu cursor-pointer overflow-hidden border-2 p-2.5 backdrop-blur-xl bg-black/40',
      showBorder && 'border-primary/40'
    ),
    style: {
      ...safeCardStyle,
      willChange: expanded || position === 0 ? 'transform' : 'auto',
    },
    animate: {
      y: expanded ? position * expandedOffsetY : position * collapsedOffsetY,
      scale: expanded ? cardScale || 1 : collapsedScale ** position,
      zIndex: ANIMATION.expanded.scale - position,
      opacity: 1,
    },
    initial: { opacity: 0, scale: 0.92, y: 0 },
    exit: {
      transition: {
        duration: DURATION.FAST,
        ease: [0.23, 1, 0.32, 1],
      },
      scale: 0.92,
      opacity: 0,
      y: 0,
    },
    transition: {
      y: {
        ...ANIMATION.transition,
        delay: cardDelay,
      },
      scale: {
        ...ANIMATION.transition,
        delay: cardDelay,
      },
      opacity: {
        ...ANIMATION.transition,
        delay: cardDelay,
      },
      zIndex: {
        delay: cardDelay,
        duration: 0,
      },
    },
  }
}
