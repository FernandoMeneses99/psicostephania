'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  changeRequestStatus,
  convertToPatient,
  type RequestActionResult,
} from '@/app/dashboard/solicitudes/actions'
import {
  REQUEST_STATUS_LABELS,
  type RequestStatus,
} from '@/lib/constants/requests'

type RequestActionsProps = {
  requestId: string
  currentStatus: RequestStatus
}

const statusOrder: RequestStatus[] = [
  'pendiente',
  'en_revision',
  'contactado',
  'programada',
  'rechazada',
]

export function RequestActions({
  requestId,
  currentStatus,
}: RequestActionsProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const currentIndex = statusOrder.indexOf(currentStatus)
  const nextStatuses = statusOrder
    .filter((_, index) => index > currentIndex)
    .filter((status) => status !== 'rechazada')

  async function runAction(action: string, fn: () => Promise<RequestActionResult>) {
    setBusy(action)
    setError(null)
    const result = await fn()
    setBusy(null)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  async function handleStatus(status: RequestStatus) {
    await runAction(status, () => changeRequestStatus(requestId, status))
  }

  async function handleConvert() {
    await runAction('convert', () => convertToPatient(requestId))
  }

  const statusActions = nextStatuses

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {statusActions.map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            disabled={busy !== null}
            onClick={() => handleStatus(status)}
          >
            {busy === status ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              `Marcar como ${REQUEST_STATUS_LABELS[status].toLowerCase()}`
            )}
          </Button>
        ))}

        {currentStatus === 'contactado' || currentStatus === 'en_revision' ? (
          <Button
            size="sm"
            disabled={busy !== null}
            onClick={handleConvert}
            className="gap-2"
          >
            {busy === 'convert' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Convertir en paciente
          </Button>
        ) : null}

        {currentStatus !== 'rechazada' ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary-700 hover:bg-primary-100"
            disabled={busy !== null}
            onClick={() => handleStatus('rechazada')}
          >
            Rechazar solicitud
          </Button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}