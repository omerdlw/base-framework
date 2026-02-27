'use client'

import Container from '@/modules/modal/container'

export default function NavigationGuardModal({ header, close, data }) {
  const { onConfirm, onCancel } = data || {}

  const handleConfirm = () => {
    onConfirm?.()
    close()
  }

  const handleCancel = () => {
    onCancel?.()
    close()
  }

  return (
    <Container header={header} close={handleCancel}>
      <div className='flex gap-3 p-4'>
        <button onClick={handleConfirm} type='button'>
          Confirm
        </button>
        <button onClick={handleCancel} type='button'>
          Cancel
        </button>
      </div>
    </Container>
  )
}
