'use client'

import { motion } from 'framer-motion'

import { ANIMATION_CONFIGS } from '@/modules/modal/config'
import { useModal } from '@/modules/modal/context'

export function PageScaleWrapper({ children }) {
  const { isOpen } = useModal()

  return (
    <motion.div
      animate={{
        scale: isOpen ? 0.95 : 1,
      }}
      transition={ANIMATION_CONFIGS.SMOOTH}
      className='h-auto w-full flex-1'
    >
      {children}
    </motion.div>
  )
}
