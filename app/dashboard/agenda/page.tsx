import type { Metadata } from 'next'
import Link from 'next/link'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'

import {
  monthName,
  selectedDayLabel,
  selectedYearMonth,
  todayKey,
} from '@/lib/dates'
import { getPatientOptions, getServiceOptions, getDayAppointments, getMonthAppointmentDays, getAppointmentsInRange, monthRangeInBogota } from '@/lib/services/appointments'
import { AppointmentForm } from '@/components/agenda/appointment-form'
import { AppointmentItem } from '@/components/agenda/appointment-item'
import { MonthGrid } from '@/components/agenda/month-grid'
import { CalendarClient } from '@/components/agenda/calendar-client'
import { shiftDateKey } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Agenda',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ date?: string }>

function isValidDateKey(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  return !Number.isNaN(new Date(`${value}T00:00:00-05:00`).getTime())
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { date: dateParam } = await searchParams
  const selectedKey = isValidDateKey(dateParam) ? dateParam : await todayKey()
  const { year, month } = selectedYearMonth(selectedKey)
  const { start: monthStart, end: monthEnd } = monthRangeInBogota(year, month)

  const [appointments, monthDays, patients, services, calendarAppointments] =
    await Promise.all([
      getDayAppointments(selectedKey),
      getMonthAppointmentDays(year, month),
      getPatientOptions(),
      getServiceOptions(),
      getAppointmentsInRange(monthStart, monthEnd),
    ])

  const previousDay = shiftDateKey(selectedKey, -1)
  const nextDay = shiftDateKey(selectedKey, 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl text-ink-900">Agenda</h1>
          <p className="mt-1 text-ink-500">
            Programa, confirma y gestiona tus consultas.
          </p>
        </div>

        <AppointmentForm
          patients={patients}
          services={services}
          defaultDate={selectedKey}
        />
      </div>

      <CalendarClient appointments={calendarAppointments} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="rounded-3xl border border-beige-100 bg-white p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans text-lg font-medium text-ink-900">
                {monthName(month)} {year}
              </p>
              <div className="flex items-center gap-1">
                <Link
                  href={`/dashboard/agenda?date=${previousDay}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-beige-100"
                  aria-label="Día anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Link>
                <Link
                  href={`/dashboard/agenda?date=${shiftDateKey(selectedKey, 1)}`}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-beige-100"
                  aria-label="Día siguiente"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <MonthGrid
              selectedKey={selectedKey}
              year={year}
              month={month}
              appointmentDays={monthDays}
            />

            <Link
              href={`/dashboard/agenda`}
              className="mt-4 block text-center text-sm font-medium text-primary-700 hover:underline"
            >
              Ir a hoy
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary-600" />
            <h2 className="font-sans text-xl text-ink-900">
              {selectedDayLabel(selectedKey)}
            </h2>
          </div>

          {appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
              <CalendarDays className="h-10 w-10 text-ink-300" />
              <p className="font-sans text-lg font-medium text-ink-700">
                Sin consultas este día
              </p>
              <p className="max-w-sm text-sm text-ink-500">
                Programe una consulta o navegue a otro día del calendario.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {appointments.map((appointment) => (
                <AppointmentItem key={appointment.id} appointment={appointment} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}