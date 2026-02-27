'use client'

import { useEffect, useMemo } from 'react'

import dynamic from 'next/dynamic'

import * as Sentry from '@sentry/nextjs'
import { MotionConfig, useReducedMotion } from 'framer-motion'

import { AnalyticsInit } from '@/components/analytics'
import { NAV_CONFIG } from '@/config/nav.config'
import { PROJECT_CONFIG } from '@/config/project.config'
import { SettingsProvider } from '@/contexts/settings-context'
import { ThemeProvider } from '@/contexts/theme-context'
import { BackgroundOverlay, BackgroundProvider } from '@/modules/background'
import { ContextMenuGlobal, ContextMenuProvider } from '@/modules/context-menu'
import { ControlsProvider } from '@/modules/controls/context'
import { CountdownOverlay, CountdownProvider } from '@/modules/countdown'
import { GlobalError } from '@/modules/error-boundary'
import { createConsoleHandler, createSentryHandler } from '@/modules/error-boundary/integrations'
import { GlobalErrorListener } from '@/modules/error-boundary/listener'
import { getErrorReporter } from '@/modules/error-boundary/reporter'
import { FeaturesProvider } from '@/modules/features'
import { LoadingOverlay, LoadingProvider } from '@/modules/loading'
import { ModalProvider } from '@/modules/modal/context'
import { NavigationProvider } from '@/modules/nav/context'
import { NotificationContainer } from '@/modules/notification'
import { NotificationProvider } from '@/modules/notification/context'
import { NotificationListener } from '@/modules/notification/listener'
import { REGISTRY_TYPES, RegistryProvider } from '@/modules/registry/context'
import { RegistryInjector } from '@/modules/registry/injector'
import { TransitionProvider } from '@/modules/transition'

const SettingsModal = dynamic(() => import('@/components/modals/settings-modal'))
const ShowcaseModal = dynamic(() => import('@/components/modals/showcase-modal'))
const GuardModal = dynamic(() => import('@/components/modals/guard-modal'))

export const AppProviders = ({ children }) => {
  const shouldReduceMotion = useReducedMotion()
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])
  const registryItems = useMemo(
    () => ({
      NAV_GUARD_MODAL: GuardModal,
      SETTINGS_MODAL: SettingsModal,
      SHOWCASE_MODAL: ShowcaseModal,
    }),
    []
  )

  useEffect(() => {
    const reporter = getErrorReporter()
    const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN

    if (sentryDsn) {
      Sentry.init({
        dsn: sentryDsn,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      })
      reporter.addHandler(createSentryHandler(Sentry))
    }

    if (process.env.NODE_ENV === 'development') {
      reporter.addHandler(createConsoleHandler({ expanded: true }))
    }
  }, [])

  return (
    <MotionConfig reducedMotion={shouldReduceMotion || prefersReducedMotion ? 'always' : 'never'}>
      <AnalyticsInit>
        <GlobalError>
          <SettingsProvider>
            <FeaturesProvider config={PROJECT_CONFIG}>
              <RegistryProvider>
                <RegistryInjector type={REGISTRY_TYPES.MODAL} items={registryItems} />
                <ThemeProvider>
                  <TransitionProvider>
                    <BackgroundProvider>
                      <NavigationProvider config={NAV_CONFIG}>
                        <ControlsProvider>
                          <NotificationProvider>
                            <LoadingProvider>
                              <CountdownProvider>
                                <ModalProvider>
                                  <ContextMenuProvider>
                                    <NotificationContainer />
                                    <NotificationListener />
                                    <GlobalErrorListener />
                                    <ContextMenuGlobal />
                                    <BackgroundOverlay />
                                    <CountdownOverlay />
                                    <LoadingOverlay />
                                    {children}
                                  </ContextMenuProvider>
                                </ModalProvider>
                              </CountdownProvider>
                            </LoadingProvider>
                          </NotificationProvider>
                        </ControlsProvider>
                      </NavigationProvider>
                    </BackgroundProvider>
                  </TransitionProvider>
                </ThemeProvider>
              </RegistryProvider>
            </FeaturesProvider>
          </SettingsProvider>
        </GlobalError>
      </AnalyticsInit>
    </MotionConfig>
  )
}
