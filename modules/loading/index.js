'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { DURATION, Z_INDEX } from '@/lib/constants'
import { Spinner } from '@/ui/spinner'

import { useLoadingState } from './context'

export { useLoadingActions, useLoadingState, LoadingProvider } from './context'

export function LoadingOverlay() {
  const { isLoading, skeleton } = useLoadingState()

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className='center fixed inset-0 h-screen w-screen bg-black'
          style={{ zIndex: Z_INDEX.LOADING }}
          transition={{ duration: DURATION.FAST }}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
        >
          {skeleton || <Spinner size={50} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
