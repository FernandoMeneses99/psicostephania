'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'
import type { AppointmentStatus } from '@/lib/constants/appointments'
import { bogotaDate } from '@/lib/utils'
import { sendAppointmentConfirmationEmail } from '@/lib/services/emailjs'

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

  // Envío del correo de confirmación al paciente (best-effort:
  // si falla el envío, la cita ya quedó creada).
  await sendAppointmentEmailFor(input, start)

  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')

  return { error: null }
}

async function sendAppointmentEmailFor(
  input: CreateAppointmentInput,
  start: Date,
): Promise<void> {
  try {
    const supabase = await createClient()

    const [patientRes, serviceRes] = await Promise.all([
      supabase
        .from('patients')
        .select('id, full_name, email')
        .eq('id', input.patient_id)
        .maybeSingle(),
      input.service_id
        ? supabase
            .from('services')
            .select('id, name, modality')
            .eq('id', input.service_id)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    const patient = patientRes.data
    const service = serviceRes.data
    const patientEmail = patient?.email

    if (!patientEmail) return

    const dateLabel = new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Bogota',
    }).format(start)

    const timeLabel = new Intl.DateTimeFormat('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota',
    }).format(start)

    await sendAppointmentConfirmationEmail({
      to_email: patientEmail,
      patient_name: patient.full_name,
      service_name: service?.name ?? null,
      date: dateLabel,
      time: timeLabel,
      modality: service?.modality ?? null,
      virtual_link: input.virtual_link ?? null,
      psychologist_name: 'Psico. Stephania Barón',
    })
  } catch {
    // silencioso: no impedir la creación de la cita
  }
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