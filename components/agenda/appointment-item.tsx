'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { updateAppointmentStatus } from '@/app/dashboard/agenda/actions'
import {
  APPOINTMENT_FLOW,
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_LABELS,
  type AppointmentStatus,
  type AppointmentWithDetails,
} from '@/lib/constants/appointments'
import { cn, formatAppointmentTime } from '@/lib/utils'

const statusTones: Record<AppointmentStatus, string> = {
  solicitud_pendiente: 'bg-primary-100 text-primary-800 border-primary-200',
  programada: 'bg-beige-200 text-ink-700 border-beige-300',
  confirmada: 'bg-sage-100 text-sage-800 border-sage-200',
  realizada: 'bg-sage-200 text-sage-900 border-sage-300',
  cancelada: 'bg-ink-100 text-ink-600 border-ink-200',
  no_asistio: 'bg-primary-200 text-primary-800 border-primary-300',
}

export function AppointmentItem({
  appointment,
}: {
  appointment: AppointmentWithDetails
}) {
  const router = useRouter()
  const [busy, setBusy] = React.useState<AppointmentStatus | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const flow = APPOINTMENT_FLOW.find((f) => f.status === appointment.status)
  const nextActions = flow?.next ?? []

  async function handleStatus(status: AppointmentStatus) {
    setBusy(status)
    setError(null)
    const result = await updateAppointmentStatus(appointment.id, status)
    setBusy(null)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  const patientName = appointment.patients?.full_name ?? 'Paciente sin asignar'

  return (
    <li className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary-100 text-center">
            <span className="text-sm font-semibold text-primary-700">
              {formatAppointmentTime(appointment.starts_at)}
            </span>
          </div>

          <div>
            <p className="font-sans text-base font-medium text-ink-900">
              {patientName}
            </p>
            <p className="text-sm text-ink-500">
              {appointment.services?.name ?? 'Sin servicio'}
              {appointment.services?.modality
                ? ` · ${APPOINTMENT_MODALITY_LABELS[appointment.services.modality]}`
                : ''}
            </p>
            {appointment.virtual_link ? (
              <a
                href={appointment.virtual_link}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium text-primary-700 hover:underline"
              >
                Enlace de la sesión
              </a>
            ) : null}
            {appointment.notes ? (
              <p className="mt-1 text-sm text-ink-400">{appointment.notes}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge
            variant="outline"
            className={cn('rounded-full', statusTones[appointment.status])}
          >
            {APPOINTMENT_STATUS_LABELS[appointment.status]}
          </Badge>

          {nextActions.length > 0 ? (
            <div className="flex flex-wrap justify-end gap-1.5">
              {nextActions.includes('confirmada') ? (
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => handleStatus('confirmada')}
                >
                  <Check className="h-3.5 w-3.5" /> Confirmar
                </Button>
              ) : null}
              {nextActions.includes('realizada') ? (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => handleStatus('realizada')}
                >
                  <Check className="h-3.5 w-3.5" /> Realizada
                </Button>
              ) : null}
              {nextActions.includes('no_asistio') ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => handleStatus('no_asistio')}
                >
                  No asistió
                </Button>
              ) : null}
              {nextActions.includes('cancelada') ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary-700 hover:bg-primary-100"
                  disabled={busy !== null}
                  onClick={() => handleStatus('cancelada')}
                >
                  <X className="h-3.5 w-3.5" /> Cancelar
                </Button>
              ) : null}
              {nextActions.includes('programada') ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => handleStatus('programada')}
                >
                  Reabrir
                </Button>
              ) : null}
            </div>
          ) : null}

          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-ink-400" />
          ) : null}
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-primary-100 px-4 py-2 text-sm text-primary-800"
        >
          {error}
        </p>
      ) : null}
    </li>
  )
}