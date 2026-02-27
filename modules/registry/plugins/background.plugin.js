import { REGISTRY_TYPES } from '../context'
import { createPlugin } from './create-plugin'

export const backgroundPlugin = createPlugin({
  name: 'background',
  apply: (config, { register, unregister }) => {
    const background = config?.background

    if (background) {
      register(REGISTRY_TYPES.BACKGROUND, 'page-background', background, 'dynamic')

      return () => {
        unregister(REGISTRY_TYPES.BACKGROUND, 'page-background', 'dynamic')
      }
    }
  },
})
