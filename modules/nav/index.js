'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { AnimatePresence, MotionConfig, motion } from 'framer-motion'

import { EASING, Z_INDEX } from '@/lib/constants'
import { useClickOutside } from '@/lib/hooks'
import { useControlsState } from '@/modules/controls/context'
import { useModal } from '@/modules/modal/context'
import { useNavigation } from '@/modules/nav/hooks'

import { MobileControlsToggle } from '../controls/elements'
import { ANIMATION } from './constants'
import Item from './item'

export default function Nav() {
  const {
    activeItemHasAction,
    activeItem,
    navigationItems,
    toggleParent,
    setNavHeight,
    setIsHovered,
    setExpanded,
    activeIndex,
    errorState,
    expanded,
    pathname,
    navigate,
  } = useNavigation()

  const [isStackHovered, setIsStackHovered] = useState(false)
  const [containerHeight, setContainerHeight] = useState(0)
  const { isOpen, hasControls } = useControlsState()
  const { isOpen: isModalOpen } = useModal()
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [actionHeight, setActionHeight] = useState(0)
  const navRef = useRef(null)

  const showControlsButton = hasControls

  const handleKeyDown = useCallback(
    (e) => {
      if (!expanded) return
      const { key } = e
      if (key === 'Escape') return e.preventDefault() || setExpanded(false)
      if (key === 'Enter' && focusedIndex !== -1)
        return e.preventDefault() || navigate(navigationItems[focusedIndex].path)
      if (key === 'ArrowDown')
        return (
          e.preventDefault() ||
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : navigationItems.length - 1))
        )
      if (key === 'ArrowUp')
        return (
          e.preventDefault() ||
          setFocusedIndex((prev) => (prev < navigationItems.length - 1 ? prev + 1 : 0))
        )
    },
    [expanded, navigationItems, focusedIndex, navigate, setExpanded]
  )

  useEffect(() => {
    if (expanded) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded, handleKeyDown])

  useEffect(() => {
    const h =
      ANIMATION.BASE_CARD_HEIGHT +
      (activeItemHasAction && actionHeight > 0 ? actionHeight + ANIMATION.ACTION_GAP : 0)
    setContainerHeight(h)
    setNavHeight(h + 16)
  }, [pathname, actionHeight, activeItemHasAction, setNavHeight])

  useEffect(() => {
    if (expanded) {
      setIsStackHovered(false)
      setFocusedIndex(activeIndex)
    } else {
      setFocusedIndex(-1)
    }
  }, [expanded, activeIndex])

  useEffect(() => setActionHeight(0), [pathname])

  useClickOutside(navRef, () => setExpanded(false))

  return (
    <MotionConfig transition={ANIMATION.transition}>
      <motion.div
        className='fixed inset-0 cursor-pointer backdrop-blur-xl'
        transition={{ ease: EASING.SMOOTH, duration: 0.25 }}
        style={{
          zIndex: Z_INDEX.NAV_BACKDROP,
          pointerEvents: expanded || errorState?.type === 'APP_ERROR' ? 'auto' : 'none',
        }}
        onClick={() => setExpanded(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded || errorState?.type === 'APP_ERROR' ? 1 : 0 }}
      >
        <div className='fixed inset-0 -z-10 h-screen w-screen bg-linear-to-t from-black via-black/40 to-black/20' />
      </motion.div>

      <AnimatePresence>
        {showControlsButton && <MobileControlsToggle navHeight={containerHeight} />}
      </AnimatePresence>

      <div
        className={`fixed bottom-2 left-1/2 mx-auto h-auto w-[400px] -translate-x-1/2 transition-all duration-300 select-none ${
          isModalOpen
            ? 'pointer-events-none'
            : isOpen
              ? 'pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100'
              : 'opacity-100'
        }`}
        style={{ zIndex: Z_INDEX.NAV }}
        id='nav-card-stack'
        ref={navRef}
      >
        <div
          style={{
            transition: 'height 450ms cubic-bezier(0.23, 1, 0.32, 1)',
            height: `${containerHeight}px`,
            position: 'relative',
          }}
        >
          <AnimatePresence mode='sync'>
            {navigationItems.map((link, i) => {
              const position = expanded ? navigationItems.length - 1 - i : i
              const isTop = position === 0
              const itemKey = link.isChild
                ? `${link.parentName}-${link.path || link.name}`
                : link.path || link.name
              const isActive = (link.path || link.name) === (activeItem?.path || activeItem?.name)

              return (
                <div key={itemKey}>
                  <Item
                    onMouseLeave={() => {
                      if (expanded) setFocusedIndex(-1)
                      if (isTop) {
                        setIsStackHovered(false)
                        pathname !== '/' && setIsHovered(false)
                      }
                    }}
                    onMouseEnter={() => {
                      if (expanded) setFocusedIndex(i)
                      if (isTop) {
                        setIsStackHovered(true)
                        pathname !== '/' && setIsHovered(true)
                      }
                    }}
                    onClick={(e) => {
                      if (link.type === 'COUNTDOWN') return

                      expanded
                        ? link.isParent
                          ? toggleParent(link.name)
                          : link.path && navigate(link.path)
                        : isTop && setExpanded(true)
                    }}
                    onActionHeightChange={isTop ? setActionHeight : null}
                    totalItems={navigationItems.length}
                    isStackHovered={isStackHovered}
                    expanded={expanded}
                    position={position}
                    isTop={isTop}
                    isActive={isActive}
                    link={link}
                  />
                </div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  )
}
