import Link from 'next/link'

import { cn, daysInMonth, weekdayOfKey } from '@/lib/utils'

const weekdayHeaders = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa']

type MonthGridProps = {
  selectedKey: string
  year: number
  month: number
  appointmentDays: string[]
}

export function MonthGrid({
  selectedKey,
  year,
  month,
  appointmentDays,
}: MonthGridProps) {
  const totalDays = daysInMonth(year, month)
  const firstWeekday = weekdayOfKey(`${year}-${String(month).padStart(2, '0')}-01`)
  const hasAppointments = new Set(appointmentDays)

  const cells: Array<{ key: string; day: number } | null> = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: totalDays }, (_, index) => ({
      key: `${year}-${String(month).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`,
      day: index + 1,
    })),
  ]

  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {weekdayHeaders.map((header) => (
          <span
            key={header}
            className="py-1 text-xs font-semibold text-ink-400"
          >
            {header}
          </span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((cell, index) =>
          cell ? (
            <Link
              key={cell.key}
              href={`/dashboard/agenda?date=${cell.key}`}
              className={cn(
                'relative flex h-9 items-center justify-center rounded-xl text-sm transition-colors',
                cell.key === selectedKey
                  ? 'bg-primary-600 font-semibold text-white shadow-soft'
                  : 'text-ink-700 hover:bg-beige-100',
              )}
              aria-label={cell.key}
            >
              {cell.day}
              {hasAppointments.has(cell.key) && cell.key !== selectedKey ? (
                <span
                  className="absolute bottom-1.5 h-1 w-1 rounded-full bg-primary-500"
                  aria-hidden
                />
              ) : null}
            </Link>
          ) : (
            <span key={`empty-${index}`} className="h-9" aria-hidden />
          ),
        )}
      </div>
    </div>
  )
}