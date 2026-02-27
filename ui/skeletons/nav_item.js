'use client'

import { CN } from '@/lib/utils'

export function Item_Nav_Skeleton({ className }) {
  return (
    <div className={CN('flex h-auto w-full animate-pulse items-center gap-3', className)}>
      <div className='size-12 shrink-0 rounded-[20px] bg-white/15' />
      <div className='flex flex-1 flex-col space-y-2 overflow-hidden'>
        <div className='h-4 w-3/4 rounded-full bg-white/15' />
        <div className='h-3 w-1/2 rounded-full bg-white/15' />
      </div>
    </div>
  )
}
