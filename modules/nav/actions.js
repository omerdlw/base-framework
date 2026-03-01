'use client'

import { useMemo } from 'react'

import { useScrollToTop } from '@/lib/hooks'
import { useBackgroundActions, useBackgroundState } from '@/modules/background/context'
import Icon from '@/ui/icon'

import { useModal } from '../modal/context'

function useDefaultNavActions() {
  const { visible: showScrollTop, scrollToTop } = useScrollToTop(100)
  const { openModal } = useModal()
  const { isVideo, videoElement } = useBackgroundState()
  const { toggleMute } = useBackgroundActions()

  return useMemo(
    () => [
      {
        key: 'scroll-top',
        icon: 'solar:arrow-up-bold',
        visible: showScrollTop,
        order: 20,
        onClick: (e) => {
          e.stopPropagation()
          scrollToTop()
        },
      },
      {
        key: 'toggle-mute',
        icon: !videoElement?.muted ? 'solar:muted-bold' : 'solar:volume-loud-bold',
        visible: !!isVideo,
        order: 10,
        onClick: (e) => {
          e.stopPropagation()
          toggleMute()
        },
      },
      {
        key: 'settings',
        icon: 'solar:settings-bold',
        visible: true,
        order: -100,
        onClick: (e) => {
          e.stopPropagation()
          openModal('SETTINGS_MODAL', 'center', {
            full: false,
            header: {
              description: 'Configure your preferences',
              title: 'Settings',
            },
          })
        },
      },
    ],
    [showScrollTop, scrollToTop, openModal, isVideo, videoElement?.muted, toggleMute]
  )
}

export function useNavActions({ activeItem } = {}) {
  const defaultActions = useDefaultNavActions()

  return useMemo(() => {
    if (activeItem?.path === 'not-found') return []

    let extendedActions = []

    if (activeItem && activeItem.actions) {
      const actions = Array.isArray(activeItem.actions) ? activeItem.actions : [activeItem.actions]
      extendedActions = actions.map((action, index) => ({
        key: action.key || `action-${index}`,
        ...action,
      }))
    }

    const allActions = [...defaultActions, ...extendedActions]
      .filter((action) => action.visible !== false)
      .filter((action) => {
        if (action.key === 'settings' && activeItem?.hideSettings) return false
        if (action.key === 'scroll-top' && activeItem?.hideScroll) return false
        return true
      })
      .sort((a, b) => (b.order || 0) - (a.order || 0))

    return allActions
  }, [defaultActions, activeItem])
}

export function NavAction({ action }) {
  return (
    <button
      className='center hover:bg-primary z-10 cursor-pointer rounded-full bg-transparent p-1 hover:text-white'
      onClick={action.onClick}
    >
      <Icon icon={action.icon} size={16} />
    </button>
  )
}

export function NavActionsContainer({ activeItem }) {
  const actions = useNavActions({ activeItem })

  return (
    <div className='absolute top-2/4 right-2 z-10 flex -translate-y-2/4 items-center gap-1'>
      {actions.map((action) => (
        <NavAction key={action.key} action={action} />
      ))}
    </div>
  )
}
