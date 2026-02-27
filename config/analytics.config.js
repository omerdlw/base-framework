export const ANALYTICS_CONFIG = {
  providers: {
    'google-analytics': {
      enabled: true,
      measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
      options: {
        debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
        sendPageView: true,
        gtagUrl: 'https://www.googletagmanager.com/gtag/js',
        config: {
          cookie_flags: 'SameSite=Lax;Secure',
          cookie_domain: 'auto',
          cookie_expires: 63072000,
          allow_google_signals: true,
          allow_ad_personalization_signals: false,
          anonymize_ip: false,
          send_page_view: true,
          debug_mode: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true',
        },
      },
    },
  },

  events: {
    pageTracking: {
      enabled: true,
      trackHashChanges: true,
    },

    formTracking: {
      enabled: true,
      trackFormStart: true,
      excludeForms: ['.no-track', '[data-no-track]'],
    },

    searchTracking: {
      enabled: true,
      searchQuerySelector: '[data-search-query]',
    },

    downloadTracking: {
      enabled: true,
      fileExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip', 'rar'],
    },

    outboundTracking: {
      enabled: true,
      trackMailto: true,
      trackTel: true,
    },

    videoTracking: {
      enabled: true,
      videoSelector: 'video, [data-video]',
    },

    scrollTracking: {
      enabled: true,
      thresholds: [25, 50, 75, 90],
    },

    errorTracking: {
      enabled: true,
      excludeErrors: ['Script error', 'Non-Error promise rejection captured'],
    },

    enhancedMeasurement: {
      enabled: true,
      trackFileDownloads: true,
      trackOutboundClicks: true,
      trackFormInteractions: true,
      trackSearchQueries: true,
      trackVideoEngagement: true,
      trackScrollEvents: true,
    },
  },

  privacy: {
    anonymizeIp: true,
    respectDoNotTrack: true,
    cookieConsentRequired: true,
  },

  exclusions: {
    internalTraffic: {
      enabled: false,
      hostnames: ['localhost', '127.0.0.1'],
    },
    development: {
      enabled: false,
      environments: ['development', 'test'],
    },
  },
}
