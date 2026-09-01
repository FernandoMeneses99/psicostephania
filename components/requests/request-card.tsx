import Link from 'next/link'
import { Inbox } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { RequestWithDetails } from '@/lib/constants/requests'
import { formatDate } from '@/lib/utils'
import { RequestStatusBadge } from '@/components/requests/request-status-badge'

export function RequestCard({ request }: { request: RequestWithDetails }) {
  return (
    <Link href={`/dashboard/solicitudes/${request.id}`} className="block">
      <Card className="transition-shadow hover:shadow-soft">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="font-sans text-base text-ink-900">
              {request.full_name}
            </CardTitle>
            <p className="mt-0.5 text-sm text-ink-500">{request.email}</p>
            {request.phone ? (
              <p className="text-sm text-ink-500">{request.phone}</p>
            ) : null}
          </div>
          <RequestStatusBadge status={request.status} />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-600">
            {request.message || 'Sin mensaje adicional.'}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
            {request.service_name ? (
              <span>Servicio: {request.service_name}</span>
            ) : (
              <span>
                <Inbox className="mr-1 inline h-3.5 w-3.5" />
                Sin servicio preferido
              </span>
            )}
            <span aria-hidden>·</span>
            <span>{formatDate(request.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}