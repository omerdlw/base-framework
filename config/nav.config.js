import TestAction from '@/components/nav-actions/test-action'

export const NAV_CONFIG = {
  items: {
    home: {
      path: '/',
      name: 'Placeholder',
      description: 'Initial Page',
      icon: 'https://images3.alphacoders.com/118/thumb-1920-1184746.png',
    },
  },

  dimensions: {
    collapsedY: -8,
    expandedY: -78,
    cardHeight: 74,
    actionGap: 10,
  },

  dynamicSources: {
    firebase: {
      servers: {
        defaultDescription: 'Select a server',
        settingsKey: 'SELECTED_SERVER',
        icon: 'solar:server-bold',
        path: '/servers',
      },
    },
    polling: {
      lastfm: {
        endpoint: 'https://ws.audioscrobbler.com/2.0/',
        icon: 'solar:music-note-bold',
        defaultTitle: 'Now Playing',
        interval: 30000,
      },
    },
  },
}
