'use client'

import dynamic from 'next/dynamic'

import type { AppointmentWithDetails } from '@/lib/constants/appointments'

const AgendaCalendar = dynamic(
  () => import('@/components/agenda/calendar').then((m) => m.AgendaCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-beige-100 bg-white p-5 shadow-card">
        <p className="text-sm text-ink-400">Cargando calendario...</p>
      </div>
    ),
  },
)

export function CalendarClient({
  appointments,
}: {
  appointments: AppointmentWithDetails[]
}) {
  return <AgendaCalendar appointments={appointments} />
}