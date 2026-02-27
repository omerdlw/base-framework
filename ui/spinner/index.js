import { CN } from '@/lib/utils'
import Icon from '@/ui/icon'

export function Spinner({ className, size }) {
  return (
    <div className={CN('inline-block animate-spin', className)} aria-label='Loading' role='status'>
      <Icon icon='mingcute:loading-3-fill' size={size} />
    </div>
  )
}
