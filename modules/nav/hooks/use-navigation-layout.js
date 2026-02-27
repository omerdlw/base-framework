'use client'

import { useMemo } from 'react'

import { usePathname } from 'next/navigation'

import { useNavigationContext } from '../context'

const MAX_VISIBLE_STACKED_CARDS = 3

export const useNavigationLayout = ({ isHovered, navigationItems, activeItem } = {}) => {
  const pathname = usePathname()
  const { expanded } = useNavigationContext()

  const displayItems = useMemo(() => {
    const items = [...navigationItems]

    let activeIdx = items.findIndex((item) => item.isDataSource && item.isSelected)

    if (activeIdx === -1 && activeItem) {
      activeIdx = items.findIndex(
        (item) =>
          (item.path && item.path === activeItem.path) ||
          (item.name && item.name === activeItem.name)
      )
    }

    if (activeIdx === -1) {
      activeIdx = items.findIndex((item) => item.path === pathname)
    }

    if (activeIdx !== -1 && activeItem) {
      items[activeIdx] = activeItem
    }

    if (expanded) {
      if (activeIdx !== -1 && activeIdx !== items.length - 1) {
        const [activeItemObj] = items.splice(activeIdx, 1)
        items.push(activeItemObj)
      } else if (activeIdx === -1 && activeItem?.isChild) {
        items.push(activeItem)
      }
      return items
    }

    if (pathname === '/' || isHovered) {
      if (activeIdx === -1) {
        if (activeItem?.isChild) {
          return [activeItem, ...items.slice(0, MAX_VISIBLE_STACKED_CARDS - 1)]
        }
        return items.slice(0, MAX_VISIBLE_STACKED_CARDS)
      }

      const reordered = [
        items[activeIdx],
        ...items.slice(0, activeIdx),
        ...items.slice(activeIdx + 1),
      ]
      return reordered.slice(0, MAX_VISIBLE_STACKED_CARDS)
    }

    return activeItem ? [activeItem] : []
  }, [pathname, expanded, isHovered, navigationItems, activeItem])

  return {
    displayItems,
    MAX_VISIBLE_STACKED_CARDS,
  }
}
