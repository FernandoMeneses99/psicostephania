import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | Date | null | undefined) {
  const valid = safeDate(value)
  if (!valid) return ''
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(valid)
}

export function formatDateTime(value: string | Date | null | undefined) {
  const valid = safeDate(value)
  if (!valid) return ''
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(valid)
}

export const BOGOTA_TIME_ZONE = 'America/Bogota'
export const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000

/** Parsea un valor de fecha devolviendo null si es inválido. */
function safeDate(value: string | Date | null | undefined): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

/** Convierte una fecha ISO a su clave local YYYY-MM-DD en Bogotá. */
export function dateKeyFromISO(iso: string | null | undefined): string {
  const valid = safeDate(iso)
  if (!valid) return '0000-00-00'
  return new Date(valid.getTime() + BOGOTA_OFFSET_MS)
    .toISOString()
    .slice(0, 10)
}

/** Crea una fecha local de Bogotá a partir de una clave YYYY-MM-DD y hora opcional HH:MM. */
export function bogotaDate(key: string, time?: string): Date {
  const suffix = time ? `T${time}:00` : 'T00:00:00'
  return new Date(`${key}${suffix}-05:00`)
}

/** Desplaza una clave YYYY-MM-DD N días en tiempo de Bogotá. */
export function shiftDateKey(key: string, days: number): string {
  const instant = bogotaDate(key).getTime() + days * 86_400_000
  return new Date(instant + BOGOTA_OFFSET_MS).toISOString().slice(0, 10)
}

/** Formatea la hora de una cita en Bogotá. */
export function formatAppointmentTime(iso: string | null | undefined): string {
  const valid = safeDate(iso)
  if (!valid) return '--:--'
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: BOGOTA_TIME_ZONE,
  }).format(valid)
}

/** Formatea el día completo de una cita en Bogotá. */
export function formatAppointmentDate(
  iso: string | null | undefined,
): string {
  const valid = safeDate(iso)
  if (!valid) return ''
  return new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(valid)
}

/** Día de la semana desde una clave YYYY-MM-DD (0 = domingo). */
export function weekdayOfKey(key: string): number {
  return new Date(bogotaDate(key).getTime() + BOGOTA_OFFSET_MS).getUTCDay()
}

/** Número de días de un mes (1-12) en Bogotá. */
export function daysInMonth(year: number, month: number): number {
  const key = `${year}-${String(month).padStart(2, '0')}-01`
  return Math.floor(
    (bogotaDate(shiftDateKey(key, 1)).getTime() -
      bogotaDate(key).getTime()) /
      86_400_000,
  )
}
