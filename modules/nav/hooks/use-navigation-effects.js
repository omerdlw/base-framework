'use client'

import { useCallback, useEffect } from 'react'

import { useNavigationContext } from '../context'
import { useNavigationCore } from './use-navigation-core'

export const useRouteChangeEffects = (setExpanded, setSearchQuery, setIsHovered) => {
  const { expandParentForPath } = useNavigationContext()
  const { pathname } = useNavigationCore()

  const resetNavigationState = useCallback(() => {
    setExpanded(false)
    setSearchQuery('')
    setIsHovered(false)
  }, [setExpanded, setSearchQuery, setIsHovered])

  useEffect(() => {
    resetNavigationState()
    const timer = setTimeout(() => {
      expandParentForPath(pathname)
    }, 150)
    return () => clearTimeout(timer)
  }, [pathname, resetNavigationState, expandParentForPath])
}
