'use server'

import { revalidatePath } from 'next/cache'

import {
  createFollowUp,
  createPatient,
  setPatientStatus,
  updateFollowUpStatus,
  updatePatient,
  type PatientInput,
} from '@/lib/services/patients'
import type { FollowUpStatus, PatientStatus } from '@/lib/constants/patients'
import { bogotaDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

export type ActionResult = { error: string | null }

export async function createPatientAction(
  input: PatientInput,
): Promise<ActionResult & { id: string | null }> {
  if (!input.full_name?.trim()) return { error: 'El nombre es obligatorio.', id: null }

  const { data, error } = await createPatient(input)
  if (error || !data) return { error: error ?? 'No se pudo crear el paciente.', id: null }

  revalidatePath('/dashboard/pacientes')
  revalidatePath('/dashboard')
  return { error: null, id: data.id }
}

export async function updatePatientAction(
  id: string,
  input: PatientInput,
): Promise<ActionResult> {
  if (!input.full_name?.trim()) return { error: 'El nombre es obligatorio.' }

  const { error } = await updatePatient(id, input)
  if (error) return { error }

  revalidatePath('/dashboard/pacientes')
  revalidatePath(`/dashboard/pacientes/${id}`)
  return { error: null }
}

export async function changePatientStatus(
  id: string,
  status: PatientStatus,
): Promise<ActionResult> {
  const { error } = await setPatientStatus(id, status)
  if (error) return { error }

  revalidatePath('/dashboard/pacientes')
  revalidatePath(`/dashboard/pacientes/${id}`)
  return { error: null }
}

export async function createFollowUpAction(
  patientId: string,
  input: {
    follow_up_date: string
    follow_up_time: string | null
    observations: string | null
    goals: string | null
    status: FollowUpStatus
  },
): Promise<ActionResult> {
  if (!input.follow_up_date) return { error: 'Indica la fecha del seguimiento.' }

  const { error } = await createFollowUp(patientId, {
    follow_up_date: input.follow_up_date,
    observations: input.observations,
    goals: { text: input.goals ?? '' },
    status: input.status,
  })
  if (error) return { error }

  // Crea una cita en la agenda para que el seguimiento programado
  // sea visible en fecha y hora dentro del calendario.
  const time = input.follow_up_time?.trim() || '09:00'
  const start = bogotaDate(input.follow_up_date, time)
  const end = new Date(start.getTime() + 50 * 60_000)

  const supabase = await createClient()
  const { error: agendaError } = await supabase.from('appointments').insert({
    patient_id: patientId,
    service_id: null,
    starts_at: start.toISOString(),
    ends_at: end.toISOString(),
    status: 'programada',
    virtual_link: null,
    notes: 'Seguimiento terapéutico',
  })
  if (agendaError) return { error: 'El seguimiento se creó, pero no se pudo agregar a la agenda.' }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  revalidatePath('/dashboard/agenda')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function changeFollowUpStatus(
  id: string,
  patientId: string,
  status: FollowUpStatus,
): Promise<ActionResult> {
  const { error } = await updateFollowUpStatus(id, status)
  if (error) return { error }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  return { error: null }
}