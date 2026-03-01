'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

class AnalyticsManager {
  constructor() {
    this.providers = new Map()
    this.queue = []
    this.isInitialized = false
  }

  registerProvider(name, provider) {
    this.providers.set(name, provider)
  }

  async initialize(config) {
    if (this.isInitialized) return

    try {
      for (const [name, providerConfig] of Object.entries(config.providers || {})) {
        if (providerConfig.enabled) {
          const provider = await this.loadProvider(name, providerConfig)
          if (provider) {
            this.registerProvider(name, provider)
            await provider.init()
          }
        }
      }

      this.isInitialized = true
      this.processQueue()
    } catch {} // eslint-disable-line no-empty
  }

  async loadProvider(name, config) {
    try {
      switch (name) {
        case 'google-analytics': {
          const { default: GoogleAnalyticsProvider } = await import('./providers/google-analytics')
          return new GoogleAnalyticsProvider(config.measurementId, config.options)
        }
        default:
          console.warn(`[Analytics] Unknown provider: ${name}`)
          return null
      }
    } catch {
      return null
    }
  }

  track(eventName, parameters = {}) {
    const event = { eventName, parameters, timestamp: Date.now() }

    if (!this.isInitialized) {
      this.queue.push(event)
      return
    }

    this.providers.forEach((provider) => {
      try {
        provider.track(eventName, parameters)
      } catch {} // eslint-disable-line no-empty
    })
  }

  identify(userId, traits = {}) {
    if (!this.isInitialized) {
      this.queue.push({ type: 'identify', userId, traits, timestamp: Date.now() })
      return
    }

    this.providers.forEach((provider) => {
      try {
        if (provider.identify) {
          provider.identify(userId, traits)
        }
      } catch {} // eslint-disable-line no-empty
    })
  }

  page(path, properties = {}) {
    if (!this.isInitialized) {
      this.queue.push({ type: 'page', path, properties, timestamp: Date.now() })
      return
    }

    this.providers.forEach((provider) => {
      try {
        if (provider.page) {
          provider.page(path, properties)
        }
      } catch {} // eslint-disable-line no-empty
    })
  }

  reset() {
    this.providers.forEach((provider) => {
      try {
        if (provider.reset) {
          provider.reset()
        }
      } catch {} // eslint-disable-line no-empty
    })
  }

  setConsent(consentSettings) {
    this.providers.forEach((provider) => {
      try {
        if (provider.setConsent) {
          provider.setConsent(consentSettings)
        }
      } catch {} // eslint-disable-line no-empty
    })
  }

  processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift()

      if (event.type === 'identify') {
        this.identify(event.userId, event.traits)
      } else if (event.type === 'page') {
        this.page(event.path, event.properties)
      } else {
        this.track(event.eventName, event.parameters)
      }
    }
  }
}

const analyticsManager = new AnalyticsManager()

const AnalyticsContext = createContext(null)

export function AnalyticsProvider({ children, config = {} }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState(null)

  const init = useCallback(
    async (providerConfig) => {
      if (isInitialized) return

      try {
        const isDebugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
        await analyticsManager.initialize(providerConfig)
        setIsInitialized(true)
        setError(null)
        if (isDebugMode) {
          console.log('[Analytics] Multi-provider initialized')
        }
      } catch (err) {
        setError(err.message)
      }
    },
    [isInitialized]
  )

  const track = useCallback((eventName, parameters = {}) => {
    analyticsManager.track(eventName, parameters)
  }, [])

  const identify = useCallback((userId, traits = {}) => {
    analyticsManager.identify(userId, traits)
  }, [])

  const page = useCallback((path, properties = {}) => {
    analyticsManager.page(path, properties)
  }, [])

  const reset = useCallback(() => {
    analyticsManager.reset()
  }, [])

  const setConsent = useCallback((consentSettings) => {
    analyticsManager.setConsent(consentSettings)
  }, [])

  const ecommerce = useMemo(
    () => ({
      viewItem: (item) => track('view_item', item),
      viewItemList: (items, itemListName) =>
        track('view_item_list', { items, item_list_name: itemListName }),
      addToCart: (item) => track('add_to_cart', item),
      removeFromCart: (item) => track('remove_from_cart', item),
      purchase: (order) => track('purchase', order),
      beginCheckout: (order) => track('begin_checkout', order),
    }),
    [track]
  )

  const value = useMemo(
    () => ({
      config,
      isInitialized,
      error,
      init,
      track,
      identify,
      page,
      reset,
      setConsent,
      ecommerce,
    }),
    [config, isInitialized, error, init, track, identify, page, reset, setConsent, ecommerce]
  )

  useEffect(() => {
    if (config && Object.keys(config).length > 0 && !isInitialized) {
      init(config)
    }
  }, [config, init, isInitialized])

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}

export function useTrack() {
  const { track } = useAnalytics()
  return track
}
