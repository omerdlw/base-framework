import { CN } from '@/lib/utils'
import Icon from '@/ui/icon'

function Title({ title, close }) {
  return (
    <div className='flex w-full items-center justify-between space-x-4 border-b border-white/10 p-2.5'>
      <h2 className='ml-2.5 text-lg font-bold uppercase'>{title}</h2>
      <div
        className='center size-10 shrink-0 cursor-pointer rounded-[20px] border border-transparent transition hover:border-white/10 hover:bg-transparent'
        onClick={() => close()}
      >
        <Icon icon='ci:close-md' />
      </div>
    </div>
  )
}

export default function Container({ children, className, header, close }) {
  return (
    <div className='flex w-full max-w-2xl min-w-sm flex-col items-center bg-transparent'>
      <Title title={header.title} close={close} />
      <div className={CN('h-auto w-full overflow-y-auto', className)}>{children}</div>
    </div>
  )
}
