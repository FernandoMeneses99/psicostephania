import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'
import {
  type ClinicalRecordRow,
  type FollowUpRow,
  type FollowUpStatus,
  type PatientRow,
  type PatientStatus,
  type PatientWithDetails,
} from '@/lib/constants/patients'

export type PatientInput = Pick<
  PatientRow,
  'full_name' | 'email' | 'phone' | 'document_type' | 'document_number' | 'birth_date' | 'notes'
>

export type ServiceResult<T> = { data: T | null; error: string | null }

export async function getPatientList(
  search?: string,
  status?: PatientStatus,
): Promise<PatientRow[]> {
  const supabase = await createClient()

  let query = supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (search?.trim()) {
    const term = search.trim()
    query = query.or(
      `full_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,document_number.ilike.%${term}%`,
    )
  }

  const { data, error } = await query

  if (error || !data) return []
  return data
}

export async function getPatientById(id: string): Promise<PatientWithDetails | null> {
  const supabase = await createClient()

  const [patientResult, recordResult, followUpsResult] = await Promise.all([
    supabase.from('patients').select('*').eq('id', id).single(),
    supabase
      .from('clinical_records')
      .select('id, updated_at')
      .eq('patient_id', id)
      .maybeSingle(),
    supabase
      .from('follow_ups')
      .select('*')
      .eq('patient_id', id)
      .order('follow_up_date', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  if (patientResult.error || !patientResult.data) return null
  if (recordResult.error || followUpsResult.error) return null

  return {
    ...patientResult.data,
    clinical_record: recordResult.data,
    follow_ups: (followUpsResult.data as FollowUpRow[]) ?? [],
  }
}

export async function createPatient(
  input: PatientInput,
): Promise<ServiceResult<PatientRow>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('patients')
    .insert({
      full_name: input.full_name,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      document_type: input.document_type?.trim() || null,
      document_number: input.document_number?.trim() || null,
      birth_date: input.birth_date || null,
      notes: input.notes?.trim() || null,
      status: 'activo',
    })
    .select('*')
    .single()

  if (error) return { data: null, error: 'No se pudo crear el paciente.' }
  return { data, error: null }
}

export async function updatePatient(
  id: string,
  input: PatientInput,
): Promise<ServiceResult<PatientRow>> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('patients')
    .update({
      full_name: input.full_name,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      document_type: input.document_type?.trim() || null,
      document_number: input.document_number?.trim() || null,
      birth_date: input.birth_date || null,
      notes: input.notes?.trim() || null,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) return { data: null, error: 'No se pudo actualizar el paciente.' }
  return { data, error: null }
}

export async function setPatientStatus(
  id: string,
  status: PatientStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('patients')
    .update({ status })
    .eq('id', id)

  if (error) return { error: 'No se pudo cambiar el estado del paciente.' }
  return { error: null }
}

export async function getClinicalRecord(
  patientId: string,
): Promise<ClinicalRecordRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clinical_records')
    .select('*')
    .eq('patient_id', patientId)
    .maybeSingle()

  if (error || !data) return null
  return data
}

export type ClinicalRecordInput = {
  reason_for_consultation: string | null
  general_info: unknown
  antecedents: unknown
  family_context: unknown
  social_context: unknown
  initial_evaluation: unknown
  therapeutic_goals: unknown
  intervention_plan: unknown
}

export async function upsertClinicalRecord(
  patientId: string,
  input: ClinicalRecordInput,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('clinical_records').upsert(
    {
      patient_id: patientId,
      reason_for_consultation: input.reason_for_consultation,
      general_info: input.general_info as Database['public']['Tables']['clinical_records']['Insert']['general_info'],
      antecedents: input.antecedents as Database['public']['Tables']['clinical_records']['Insert']['antecedents'],
      family_context: input.family_context as Database['public']['Tables']['clinical_records']['Insert']['family_context'],
      social_context: input.social_context as Database['public']['Tables']['clinical_records']['Insert']['social_context'],
      initial_evaluation: input.initial_evaluation as Database['public']['Tables']['clinical_records']['Insert']['initial_evaluation'],
      therapeutic_goals: input.therapeutic_goals as Database['public']['Tables']['clinical_records']['Insert']['therapeutic_goals'],
      intervention_plan: input.intervention_plan as Database['public']['Tables']['clinical_records']['Insert']['intervention_plan'],
    },
    { onConflict: 'patient_id' },
  )

  if (error) return { error: 'No se pudo guardar la historia clínica.' }
  return { error: null }
}

export async function createFollowUp(
  patientId: string,
  input: {
    follow_up_date: string
    observations: string | null
    goals: unknown
    status: FollowUpStatus
  },
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('follow_ups').insert({
    patient_id: patientId,
    follow_up_date: input.follow_up_date,
    observations: input.observations?.trim() || null,
    goals: input.goals as Database['public']['Tables']['follow_ups']['Insert']['goals'],
    status: input.status,
  })

  if (error) return { error: 'No se pudo crear el seguimiento.' }
  return { error: null }
}

export async function updateFollowUpStatus(
  id: string,
  status: FollowUpStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('follow_ups').update({ status }).eq('id', id)

  if (error) return { error: 'No se pudo actualizar el seguimiento.' }
  return { error: null }
}