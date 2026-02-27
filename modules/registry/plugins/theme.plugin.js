import { REGISTRY_TYPES } from '../context'
import { createPlugin } from './create-plugin'

export const themePlugin = createPlugin({
  name: 'theme',
  apply: (config, { register, unregister }) => {
    const theme = config?.theme
    if (!theme) return

    register(REGISTRY_TYPES.THEME, 'page-theme', theme, 'dynamic')

    return () => {
      unregister(REGISTRY_TYPES.THEME, 'page-theme', 'dynamic')
    }
  },
})
