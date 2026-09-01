import type { Metadata } from 'next'
import { Inbox } from 'lucide-react'

import { RequestCard } from '@/components/requests/request-card'
import {
  getRequestList,
} from '@/lib/services/requests-admin'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from '@/lib/constants/requests'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Solicitudes',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ status?: string }>

const filterOptions: Array<{ value: RequestStatus | 'todas'; label: string }> = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendiente', label: REQUEST_STATUS_LABELS.pendiente },
  { value: 'en_revision', label: REQUEST_STATUS_LABELS.en_revision },
  { value: 'contactado', label: REQUEST_STATUS_LABELS.contactado },
  { value: 'programada', label: REQUEST_STATUS_LABELS.programada },
  { value: 'rechazada', label: REQUEST_STATUS_LABELS.rechazada },
]

function isValidStatus(value: string | undefined): value is RequestStatus {
  return REQUEST_STATUSES.some((status) => status === value)
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { status } = await searchParams
  const activeStatus = isValidStatus(status) ? status : 'todas'

  const requests = await getRequestList(
    activeStatus === 'todas' ? undefined : activeStatus,
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">Solicitudes</h1>
        <p className="mt-1 text-ink-500">
          Revisa y gestiona las solicitudes de atención de tus pacientes.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <a
            key={option.value}
            href={
              option.value === 'todas'
                ? '/dashboard/solicitudes'
                : `/dashboard/solicitudes?status=${option.value}`
            }
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeStatus === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-white text-ink-500 hover:bg-beige-100',
            )}
          >
            {option.label}
          </a>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <Inbox className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            No hay solicitudes {activeStatus !== 'todas' ? 'en este estado' : 'aún'}
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            {activeStatus === 'pendiente'
              ? 'Comparte el formulario de la landing para recibir solicitudes.'
              : 'Las solicitudes que reciban tus pacientes aparecerán aquí.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}