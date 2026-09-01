import { Badge } from '@/components/ui/badge'
import {
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from '@/lib/constants/requests'
import { cn } from '@/lib/utils'

const badgeTones: Record<RequestStatus, string> = {
  pendiente: 'bg-primary-100 text-primary-800 border-primary-200',
  en_revision: 'bg-beige-200 text-ink-700 border-beige-300',
  contactado: 'bg-sage-100 text-sage-800 border-sage-200',
  programada: 'bg-sage-200 text-sage-900 border-sage-300',
  rechazada: 'bg-ink-100 text-ink-600 border-ink-200',
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant="outline" className={cn('rounded-full', badgeTones[status])}>
      {REQUEST_STATUS_LABELS[status]}
    </Badge>
  )
}