import Icon from '@/ui/icon'

export default function ControlButton({ icon, text, desc, className }) {
  if (icon.position === 'right') {
    return (
      <button
        className={`flex h-14 cursor-pointer items-center rounded-[20px] border border-white/10 bg-black/40 p-1 transition-all duration-200 ease-in-out hover:border-transparent hover:bg-white/5 ${className || ''}`}
      >
        <div className='flex flex-1 flex-col -space-y-0.5 px-3 text-right'>
          {text && <div className=''>{text}</div>}
          {desc && <div className='text-xs opacity-70'>{desc}</div>}
        </div>
        {icon && (
          <div className='center h-full w-[44px] shrink-0 rounded-[18px] bg-white/5'>
            <Icon icon={icon.name} size={icon.size} />
          </div>
        )}
      </button>
    )
  } else {
    return (
      <button
        className={`flex h-14 cursor-pointer items-center rounded-[20px] border border-white/10 bg-black/40 p-1 transition-all duration-200 ease-in-out hover:border-transparent hover:bg-white/5 ${className || ''}`}
      >
        {icon && (
          <div className='center h-full w-[44px] shrink-0 rounded-[18px] bg-white/5'>
            <Icon icon={icon.name} size={icon.size} />
          </div>
        )}
        <div className='flex flex-1 flex-col -space-y-0.5 px-3 text-left'>
          {text && <div className=''>{text}</div>}
          {desc && <div className='text-xs opacity-70'>{desc}</div>}
        </div>
      </button>
    )
  }
}
