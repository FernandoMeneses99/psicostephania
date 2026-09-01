import { createClient } from '@/lib/supabase/server'
import type { AppointmentWithDetails } from '@/lib/constants/appointments'
import { bogotaDate, dateKeyFromISO } from '@/lib/utils'

/**
 * Rango en ISO UTC de un día local de Bogotá (clave YYYY-MM-DD).
 */
export function dayRangeInBogota(key: string): { start: string; end: string } {
  const start = bogotaDate(key)
  return {
    start: start.toISOString(),
    end: new Date(start.getTime() + 86_400_000).toISOString(),
  }
}

/**
 * Rango en ISO UTC de un mes local de Bogotá.
 * month es 1-12.
 */
export function monthRangeInBogota(year: number, month: number): { start: string; end: string } {
  const start = bogotaDate(`${year}-${String(month).padStart(2, '0')}-01`)
  return {
    start: start.toISOString(),
    end: new Date(start.getTime() + 32 * 86_400_000).toISOString(),
  }
}

export async function getDayAppointments(
  key: string,
): Promise<AppointmentWithDetails[]> {
  const supabase = await createClient()
  const { start, end } = dayRangeInBogota(key)

  const { data, error } = await supabase
    .from('appointments')
    .select(
      '*, patients(id, full_name, email, phone), services(id, name, modality)',
    )
    .gte('starts_at', start)
    .lt('starts_at', end)
    .order('starts_at', { ascending: true })

  if (error || !data) return []
  return data as AppointmentWithDetails[]
}

/**
 * Fechas ISO locales (claves YYYY-MM-DD) del mes que tienen citas.
 */
export async function getMonthAppointmentDays(
  year: number,
  month: number,
): Promise<string[]> {
  const supabase = await createClient()
  const { start, end } = monthRangeInBogota(year, month)

  const { data, error } = await supabase
    .from('appointments')
    .select('starts_at')
    .gte('starts_at', start)
    .lt('starts_at', end)

  if (error || !data) return []

  return [
    ...new Set(
      data.map((appointment) => dateKeyFromISO(appointment.starts_at)),
    ),
  ]
}

export type PatientOption = {
  id: string
  full_name: string
}

export type ServiceOption = {
  id: string
  name: string
  duration_minutes: number | null
  modality: string | null
}

/**
 * Lista los pacientes activos para el selector de citas.
 */
export async function getPatientOptions(): Promise<PatientOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('patients')
    .select('id, full_name')
    .eq('status', 'activo')
    .order('full_name', { ascending: true })

  if (error || !data) return []
  return data
}

/**
 * Lista los servicios activos para el selector de citas.
 */
export async function getServiceOptions(): Promise<ServiceOption[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('id, name, duration_minutes, modality')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error || !data) return []
  return data
}