'use client'

import { ModuleError } from '@/modules/error-boundary'
import { TransitionWrapper } from '@/modules/transition'

export default function Template({ children }) {
  return (
    <ModuleError>
      <TransitionWrapper>{children}</TransitionWrapper>
    </ModuleError>
  )
}
