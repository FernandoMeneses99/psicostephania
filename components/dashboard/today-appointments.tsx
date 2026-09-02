import Link from 'next/link'
import { CalendarDays } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  APPOINTMENT_MODALITY_LABELS,
  APPOINTMENT_STATUS_LABELS,
  FOLLOW_UP_NOTE,
  isFollowUpAppointment,
  type AppointmentStatus,
  type AppointmentWithDetails,
} from '@/lib/constants/appointments'
import { cn } from '@/lib/utils'

const statusTones: Record<AppointmentStatus, string> = {
  solicitud_pendiente: 'bg-primary-100 text-primary-800 border-primary-200',
  programada: 'bg-beige-200 text-ink-700 border-beige-300',
  confirmada: 'bg-sage-100 text-sage-800 border-sage-200',
  realizada: 'bg-sage-200 text-sage-900 border-sage-300',
  cancelada: 'bg-ink-100 text-ink-600 border-ink-200',
  no_asistio: 'bg-primary-200 text-primary-800 border-primary-300',
}

export function TodayAppointments({
  appointments,
}: {
  appointments: AppointmentWithDetails[]
}) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-beige-200 bg-beige-50 px-6 py-10 text-center">
        <CalendarDays className="h-8 w-8 text-ink-400" />
        <p className="text-sm font-medium text-ink-700">
          No tienes consultas hoy
        </p>
        <p className="text-sm text-ink-500">
          Disfruta el día o agenda nuevas citas desde la agenda.
        </p>
        <Button asChild variant="outline" size="sm" className="mt-2">
          <Link href="/dashboard/agenda">Ver agenda</Link>
        </Button>
      </div>
    )
  }

  const upcoming = appointments.filter((a) =>
    ['programada', 'confirmada'].includes(a.status),
  )
  const finished = appointments.filter(
    (a) => !['programada', 'confirmada'].includes(a.status),
  )
  const ordered = [...upcoming, ...finished]

  return (
    <ul className="space-y-3">
      {ordered.map((appointment) => (
        <li
          key={appointment.id}
          className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary-100">
                <span className="text-sm font-semibold text-primary-700">
                  {new Intl.DateTimeFormat('es-CO', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Bogota',
                  }).format(new Date(appointment.starts_at))}
                </span>
              </div>
              <div>
                <p className="font-sans text-base font-medium text-ink-900">
                  {appointment.patients?.full_name ?? 'Paciente sin asignar'}
                </p>
                <p className="text-sm text-ink-500">
                  {isFollowUpAppointment(appointment)
                    ? FOLLOW_UP_NOTE
                    : appointment.services?.name ?? 'Sin servicio'}
                  {!isFollowUpAppointment(appointment) &&
                  appointment.services?.modality
                    ? ` · ${
                        APPOINTMENT_MODALITY_LABELS[
                          appointment.services.modality
                        ]
                      }`
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
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn('rounded-full', statusTones[appointment.status])}
            >
              {APPOINTMENT_STATUS_LABELS[appointment.status]}
            </Badge>
          </div>
        </li>
      ))}
    </ul>
  )
}
