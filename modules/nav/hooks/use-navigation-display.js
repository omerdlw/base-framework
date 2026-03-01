'use client'

import { useMemo } from 'react'
import React from 'react'

import { usePathname } from 'next/navigation'

import MediaAction from '@/components/nav-actions/media-action'
import { useBackgroundActions, useBackgroundState } from '@/modules/background/context'
import { useCountdownState } from '@/modules/countdown'

import { useNavigationContext } from '../context'
import { useNavigationError } from './use-navigation-error'
import { useNavigationItems } from './use-navigation-items'

export const useNavigationDisplay = () => {
  const pathname = usePathname()
  const { rawItems } = useNavigationItems()
  const { expanded, expandedParents, searchQuery } = useNavigationContext()
  const errorState = useNavigationError()
  const { isEnabled: isCountdownEnabled, timeLeft, config: countdownConfig } = useCountdownState()

  const { isVideo, isPlaying: isBackgroundPlaying } = useBackgroundState()
  const { toggleVideo: toggleBackgroundVideo } = useBackgroundActions()

  const isNotFoundPage = useMemo(() => {
    return rawItems.some((item) => item.path === 'not-found')
  }, [rawItems])

  const countdownItem = useMemo(() => {
    if (!isCountdownEnabled) return null
    const pad = (n) => String(n).padStart(2, '0')
    return {
      type: 'COUNTDOWN',
      name: 'countdown',
      path: '/countdown',
      title: `${timeLeft.days ? pad(timeLeft.days) + ' days ' : ''}${pad(timeLeft.hours)} hours ${pad(timeLeft.minutes)} minutes`,
      description: countdownConfig?.announcement || 'Scheduled Maintenance',
      icon: isBackgroundPlaying ? 'mdi:pause' : 'mdi:play',
      style: {
        title: {
          className: 'font-mono',
        },
      },
      hideSettings: true,
      hideScroll: true,
      action: null,
      onClick: toggleBackgroundVideo,
      children: null,
    }
  }, [isCountdownEnabled, timeLeft, countdownConfig, isBackgroundPlaying, toggleBackgroundVideo])

  const activeIndex = useMemo(() => {
    let idx = rawItems.findIndex((item) => item.isDataSource && item.isSelected)
    if (idx !== -1) return idx

    if (isNotFoundPage) {
      idx = rawItems.findIndex((item) => item.path === 'not-found')
      return Math.max(0, idx)
    }

    idx = rawItems.findIndex((item) => item.path === pathname)
    return Math.max(0, idx)
  }, [pathname, rawItems, isNotFoundPage])

  const navigationItems = useMemo(() => {
    if (countdownItem) return [countdownItem]

    let items = []

    const itemsToProcess = isNotFoundPage
      ? rawItems.filter((item) => item.path === '/' || item.path === 'not-found')
      : rawItems

    itemsToProcess.forEach((item) => {
      const hasChildren = !!item.children
      const parentExpanded = hasChildren && expandedParents.has(item.name)
      items.push({
        ...item,
        isParent: hasChildren,
        isExpanded: parentExpanded,
      })
      if (parentExpanded && item.children) {
        item.children.forEach((child) =>
          items.push({ ...child, isChild: true, parentName: item.name })
        )
      }
    })
    items = items.map((item, i) => ({
      ...item,
      shortcut: i < 9 ? String(i + 1) : null,
    }))

    if (expanded && searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name?.toLowerCase().includes(lowerQuery) ||
          item.title?.toLowerCase().includes(lowerQuery) ||
          item.description?.toLowerCase().includes(lowerQuery)
      )
    }
    return items
  }, [rawItems, expanded, searchQuery, expandedParents, isNotFoundPage, countdownItem])

  const activeItem = useMemo(() => {
    let foundItem = rawItems[0] || null

    const selectedDataSource = navigationItems.find((item) => item.isDataSource && item.isSelected)

    if (selectedDataSource) foundItem = selectedDataSource
    else if (isNotFoundPage) {
      const notFoundItem = rawItems.find((item) => item.path === 'not-found')
      if (notFoundItem) foundItem = notFoundItem
    } else {
      const found = navigationItems.find((item) => item.path === pathname)
      if (found) foundItem = found
      else {
        const rawFound = rawItems.find((item) => item.path === pathname)
        if (rawFound) foundItem = rawFound
        else {
          for (const item of rawItems) {
            if (item.children) {
              const child = item.children.find((c) => c.path === pathname)
              if (child) {
                foundItem = { ...child, isChild: true, parentName: item.name }
                break
              }
            }
          }
        }
      }
    }

    if (errorState && errorState.isError && foundItem) {
      return {
        ...foundItem,
        ...errorState,
        action: errorState.action || foundItem.action,
      }
    }

    if (countdownItem) return countdownItem

    if (errorState && foundItem) {
      return {
        ...foundItem,
        ...errorState,
        action: errorState.action || foundItem.action,
      }
    }

    if (foundItem && !foundItem.isParent && isVideo) {
      const showMediaAction = foundItem.mediaAction !== false
      let mergedAction = showMediaAction ? <MediaAction /> : null

      if (foundItem.action) {
        if (React.isValidElement(foundItem.action)) {
          mergedAction = (
            <div className='flex flex-col gap-2'>
              {foundItem.action}
              {showMediaAction && <MediaAction />}
            </div>
          )
        } else if (typeof foundItem.action === 'function') {
          const Component = foundItem.action
          mergedAction = (
            <div className='flex flex-col gap-2'>
              <Component />
              {showMediaAction && <MediaAction />}
            </div>
          )
        }
      }

      return {
        ...foundItem,
        action: mergedAction,
        onClick: (e) => {
          if (e && typeof e.preventDefault === 'function') {
            e.preventDefault()
          }
          if (e && typeof e.stopPropagation === 'function') {
            e.stopPropagation()
          }

          toggleBackgroundVideo()
        },
      }
    }

    return foundItem
  }, [
    pathname,
    navigationItems,
    rawItems,
    isNotFoundPage,
    errorState,
    countdownItem,
    isVideo,
    isBackgroundPlaying,
    toggleBackgroundVideo,
  ])

  return {
    navigationItems,
    activeItem,
    activeIndex,
    errorState,
  }
}
