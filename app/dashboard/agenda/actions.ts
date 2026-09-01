'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import type { AppointmentStatus } from '@/lib/constants/appointments'
import { bogotaDate } from '@/lib/utils'

export type CreateAppointmentInput = {
  patient_id: string
  service_id: string | null
  date: string
  start_time: string
  duration_minutes: number
  virtual_link?: string | null
  notes?: string | null
}

export type AgendaActionResult = { error: string | null }

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<AgendaActionResult> {
  if (!input.patient_id) return { error: 'Selecciona un paciente.' }
  if (!input.date || !input.start_time)
    return { error: 'Indica la fecha y la hora de la consulta.' }

  const duration = Number(input.duration_minutes)
  if (!Number.isFinite(duration) || duration <= 0)
    return { error: 'La duración no es válida.' }

  const start = bogotaDate(input.date, input.start_time)
  const end = new Date(start.getTime() + duration * 60_000)

  const supabase = await createClient()
  const { error } = await supabase.from('appointments').insert({
    patient_id: input.patient_id,
    service_id: input.service_id,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    status: 'programada',
    virtual_link: input.virtual_link?.trim() || null,
    notes: input.notes?.trim() || null,
  })

  if (error) return { error: 'No se pudo crear la consulta.' }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')

  return { error: null }
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<AgendaActionResult> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (error) return { error: 'No se pudo actualizar la consulta.' }

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')

  return { error: null }
}