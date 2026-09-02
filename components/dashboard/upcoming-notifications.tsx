'use client'

import * as React from 'react'
import Link from 'next/link'
import { BellRing, X } from 'lucide-react'

import { formatAppointmentTime, dateKeyFromISO } from '@/lib/utils'

type UpcomingAppointment = {
  id: string
  starts_at: string
  status: 'programada' | 'confirmada'
  patients: { id: string; full_name: string } | null
  services: { id: string; name: string } | null
}

type Reminder = {
  id: string
  starts_at: string
  patientName: string
  serviceName: string | null
  statusLabel: 'programada' | 'confirmada'
}

const POLL_INTERVAL_MS = 30_000
const WINDOW_MINUTES = 30
const SEEN_KEY = 'ps-recordatorios-vistos'
const STATUS_LABEL: Record<'programada' | 'confirmada', string> = {
  programada: 'Programada',
  confirmada: 'Confirmada',
}

function formatRelative(startIso: string): string {
  const diffMs = new Date(startIso).getTime() - Date.now()
  if (diffMs <= 0) return 'empieza ahora'
  const minutes = Math.ceil(diffMs / 60_000)
  if (minutes < 60) return `en ${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `en ${hours} h ${rest} min` : `en ${hours} h`
}

export function UpcomingNotifications() {
  const [reminders, setReminders] = React.useState<Reminder[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const dismissKey = React.useCallback((id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
    try {
      const raw = localStorage.getItem(SEEN_KEY)
      const seen = raw ? (JSON.parse(raw) as string[]) : []
      localStorage.setItem(SEEN_KEY, JSON.stringify([...seen, id]))
    } catch {
      /* ignore */
    }
  }, [])

  React.useEffect(() => {
    if (!mounted) return

    let cancelled = false

    async function poll() {
      try {
        const res = await fetch(
          `/api/appointments/upcoming?window=${WINDOW_MINUTES}`,
          { cache: 'no-store' },
        )
        if (!res.ok) return
        const json = (await res.json()) as {
          appointments?: UpcomingAppointment[]
        }
        if (cancelled) return

        let seen: string[] = []
        try {
          const raw = localStorage.getItem(SEEN_KEY)
          seen = raw ? (JSON.parse(raw) as string[]) : []
        } catch {
          /* ignore */
        }

        const fresh: Reminder[] = (json.appointments ?? [])
          .filter((a) => !seen.includes(a.id))
          .map((a) => ({
            id: a.id,
            starts_at: a.starts_at,
            patientName: a.patients?.full_name ?? 'Paciente sin asignar',
            serviceName: a.services?.name ?? null,
            statusLabel: a.status,
          }))

        setReminders(fresh)
      } catch {
        /* silencioso: reintenta en el siguiente ciclo */
      }
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [mounted])

  if (!mounted || reminders.length === 0) return null

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      {reminders.map((reminder) => (
        <div
          key={reminder.id}
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-beige-100 bg-white p-4 shadow-floating"
        >
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <BellRing className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wider text-primary-600">
              Cita próxima · {formatRelative(reminder.starts_at)}
            </p>
            <p className="mt-1 font-sans text-base font-medium text-ink-900">
              {reminder.patientName}
            </p>
            <p className="truncate text-sm text-ink-500">
              {reminder.serviceName ?? 'Sin servicio'} ·{' '}
              {formatAppointmentTime(reminder.starts_at)} ·{' '}
              {STATUS_LABEL[reminder.statusLabel] ?? reminder.statusLabel}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/dashboard/agenda?date=${dateKeyFromISO(reminder.starts_at)}`}
                className="text-sm font-medium text-primary-700 hover:underline"
              >
                Ver en la agenda
              </Link>
            </div>
          </div>
          <button
            type="button"
            onClick={() => dismissKey(reminder.id)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-beige-100 hover:text-ink-700"
            aria-label="Descartar notificación"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
