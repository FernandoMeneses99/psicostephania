import { BOGOTA_OFFSET_MS, bogotaDate } from '@/lib/utils'

/** Clave YYYY-MM-DD del día actual en Bogotá. */
export function todayKey(): string {
  return new Date(Date.now() + BOGOTA_OFFSET_MS).toISOString().slice(0, 10)
}

/** Extrae { year, month } (1-12) de una clave YYYY-MM-DD. */
export function selectedYearMonth(key: string): { year: number; month: number } {
  const [, year, month] = key.split('-').map(Number)
  return { year, month: month || 1 }
}

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export function monthName(month: number): string {
  return monthNames[month - 1] ?? ''
}

/** Etiqueta legible de un día, p. ej. "Lunes, 1 de septiembre". */
export function selectedDayLabel(key: string): string {
  const utc = new Date(bogotaDate(key).getTime() - BOGOTA_OFFSET_MS)
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(utc)
}