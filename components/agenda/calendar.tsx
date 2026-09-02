'use client'

import { useRouter } from 'next/navigation'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import esLocale from '@fullcalendar/core/locales/es'
import type { EventClickArg, DateSelectArg } from '@fullcalendar/core'
import type { CalendarOptions } from '@fullcalendar/core'

import type { AppointmentWithDetails } from '@/lib/constants/appointments'

const STATUS_COLORS: Record<AppointmentWithDetails['status'], string> = {
  solicitud_pendiente: '#f59e0b',
  programada: '#94a3b8',
  confirmada: '#34d399',
  realizada: '#10b981',
  cancelada: '#f87171',
  no_asistio: '#fbbf24',
}

type CalendarProps = {
  appointments: AppointmentWithDetails[]
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10)
}

export function AgendaCalendar({ appointments }: CalendarProps) {
  const router = useRouter()

  const events = appointments.map((appointment) => ({
    id: appointment.id,
    title: appointment.patients?.full_name ?? 'Sin paciente',
    start: appointment.starts_at,
    end: appointment.ends_at,
    allDay: false,
    backgroundColor: STATUS_COLORS[appointment.status],
    borderColor: STATUS_COLORS[appointment.status],
    extendedProps: { date: toDateKey(appointment.starts_at) },
  }))

  function handleEventClick(info: EventClickArg) {
    const key = info.event.extendedProps.date as string
    router.push(`/dashboard/agenda?date=${key}`)
  }

  function handleSelect(info: DateSelectArg) {
    router.push(`/dashboard/agenda?date=${toDateKey(info.startStr)}`)
  }

  const options: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    height: 'auto',
    nowIndicator: true,
    slotMinTime: '06:00:00',
    slotMaxTime: '22:00:00',
    selectable: true,
    select: handleSelect,
    eventClick: handleEventClick,
    eventDisplay: 'block',
    dayMaxEvents: 3,
    firstDay: 1,
    events,
  }

  return (
    <div className="rounded-3xl border border-beige-100 bg-white p-5 shadow-card">
      <FullCalendar {...options} />
    </div>
  )
}