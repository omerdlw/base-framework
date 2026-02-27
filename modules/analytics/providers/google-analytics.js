'use client'

import { IS_BROWSER } from '@/lib/utils'

class GoogleAnalyticsProvider {
  constructor(measurementId, options = {}) {
    this.measurementId = measurementId
    this.options = {
      debug: options.debug || false,
      sendPageView: options.sendPageView !== false,
      gtagUrl: options.gtagUrl || 'https://www.googletagmanager.com/gtag/js',
      ...options,
    }
    this.isInitialized = false
    this.queue = []
  }

  async init() {
    if (!IS_BROWSER() || this.isInitialized) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      try {
        window.dataLayer = window.dataLayer || []

        window.gtag = function gtag() {
          window.dataLayer.push(arguments)
        }

        window.gtag('js', new Date())
        window.gtag('config', this.measurementId, {
          debug_mode: this.options.debug,
          send_page_view: this.options.sendPageView,
          ...this.options.config,
        })

        const script = document.createElement('script')
        script.async = true
        script.src = `${this.options.gtagUrl}?id=${this.measurementId}`
        script.onload = () => {
          this.isInitialized = true
          this.processQueue()
          resolve()
        }
        script.onerror = () => {
          reject(new Error('Failed to load Google Analytics script'))
        }

        document.head.appendChild(script)
      } catch (error) {
        reject(error)
      }
    })
  }

  processQueue() {
    while (this.queue.length > 0) {
      const queuedItem = this.queue.shift()
      if (!queuedItem) continue

      if (queuedItem.action === 'identify') {
        this.identify(queuedItem.userId, queuedItem.traits)
        continue
      }

      if (queuedItem.action === 'page') {
        this.page(queuedItem.path, queuedItem.properties)
        continue
      }

      if (queuedItem.type && Array.isArray(queuedItem.args)) {
        this.track(queuedItem.type, ...queuedItem.args)
        continue
      }

      this.track(queuedItem.eventName, queuedItem.parameters)
    }
  }

  track(eventName, parameters = {}) {
    const isDebugMode = this.options.debug

    if (!this.isInitialized) {
      if (isDebugMode) {
        console.log(`[Analytics] GA4: Queuing event ${eventName}`, parameters)
      }
      this.queue.push({
        action: 'track',
        eventName,
        parameters,
      })
      return
    }

    try {
      if (window.gtag) {
        window.gtag('event', eventName, parameters)
        if (isDebugMode) {
          console.log(`[Analytics] GA4: Event sent - ${eventName}`, parameters)
        }
      }
    } catch { } // eslint-disable-line no-empty
  }

  identify(userId, traits = {}) {
    if (!this.isInitialized) {
      this.queue.push({
        action: 'identify',
        userId,
        traits,
      })
      return
    }

    try {
      if (window.gtag) {
        window.gtag('config', this.measurementId, {
          user_id: userId,
          ...traits,
        })
      }
    } catch { } // eslint-disable-line no-empty
  }

  page(path, properties = {}) {
    if (!this.isInitialized) {
      this.queue.push({
        action: 'page',
        path,
        properties,
      })
      return
    }

    try {
      if (window.gtag) {
        window.gtag('event', 'page_view', {
          page_path: path,
          ...properties,
        })
      }
    } catch { } // eslint-disable-line no-empty
  }

  reset() {
    try {
      if (window.gtag) {
        window.gtag('config', this.measurementId, {
          user_id: undefined,
        })
      }
    } catch { } // eslint-disable-line no-empty
  }

  setConsent(consentSettings) {
    try {
      if (window.gtag) {
        window.gtag('consent', 'update', consentSettings)
      }
    } catch { } // eslint-disable-line no-empty
  }
}

export default GoogleAnalyticsProvider
