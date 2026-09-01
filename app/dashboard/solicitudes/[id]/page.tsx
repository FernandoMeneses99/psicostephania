import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Inbox } from 'lucide-react'

import { RequestActions } from '@/components/requests/request-actions'
import { RequestStatusBadge } from '@/components/requests/request-status-badge'
import { Card, CardContent } from '@/components/ui/card'
import { getRequestById } from '@/lib/services/requests-admin'
import { formatDateTime } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Solicitud',
  robots: { index: false, follow: false },
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const request = await getRequestById(id)

  if (!request) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/solicitudes"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a solicitudes
          </Link>
          <h1 className="mt-2 font-sans text-3xl text-ink-900">
            {request.full_name}
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-ink-500">
            Recibida el <time>{formatDateTime(request.created_at)}</time>
            <RequestStatusBadge status={request.status} />
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6">
          <RequestActions requestId={request.id} currentStatus={request.status} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="font-sans text-lg text-ink-900">Información de contacto</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-ink-400">Correo electrónico</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink-800">
                {request.email}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-400">Teléfono</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink-800">
                {request.phone || 'No indicado'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink-400">Servicio de interés</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink-800">
                {request.service_name || 'No indicado'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="font-sans text-lg text-ink-900">Mensaje</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
            {request.message || (
              <span className="text-ink-400">
                <Inbox className="mr-1 inline h-4 w-4" />
                Sin mensaje adicional.
              </span>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}