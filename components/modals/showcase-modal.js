import { Title } from '@/modules/nav/elements'

export default function ShowcaseModal({ header, close, data }) {
  return (
    <div className='flex h-full w-full flex-col p-6'>
      <Title title={header?.title || 'Showcase Modal'} />

      <div className='flex-1 overflow-auto'>
        <p className='mb-4 opacity-70'>
          {header?.description ||
            'This is a test modal to show different positions and animations.'}
        </p>

        <div className='space-y-4'>
          <div className='rounded-xl bg-white/5 p-4'>
            <h3 className='mb-2 font-semibold'>Modal Data</h3>
            <pre className='text-xs opacity-50'>{JSON.stringify(data, null, 2)}</pre>
          </div>

          <div className='center h-40 w-full rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20'>
            <span className='text-sm italic opacity-50'>Scrollable content test...</span>
          </div>
          <div className='center h-40 w-full rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20'>
            <span className='text-sm italic opacity-50'>More content...</span>
          </div>
        </div>
      </div>

      <div className='mt-6 flex justify-end gap-3'>
        <button
          onClick={() => close()}
          className='rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20'
        >
          Cancel
        </button>
        <button
          onClick={() => close('success')}
          className='rounded-xl bg-blue-600 px-4 py-2 hover:bg-blue-700'
        >
          Confirm
        </button>
      </div>
    </div>
  )
}
