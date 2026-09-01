'use server'

import { revalidatePath } from 'next/cache'

import { upsertClinicalRecord } from '@/lib/services/patients'
import { TEXT_JSON_FIELDS } from '@/lib/constants/patients'

export type SaveClinicalRecordResult = { error: string | null }

export async function saveClinicalRecordAction(
  patientId: string,
  formData: {
    reason_for_consultation: string | null
    fields: Record<string, string>
  },
): Promise<SaveClinicalRecordResult> {
  const jsonFields: Record<string, unknown> = {}
  for (const field of TEXT_JSON_FIELDS) {
    jsonFields[field.key] = { text: formData.fields[field.key] ?? '' }
  }

  const { error } = await upsertClinicalRecord(patientId, {
    reason_for_consultation: formData.reason_for_consultation?.trim() || null,
    general_info: jsonFields.general_info,
    antecedents: jsonFields.antecedents,
    family_context: jsonFields.family_context,
    social_context: jsonFields.social_context,
    initial_evaluation: jsonFields.initial_evaluation,
    therapeutic_goals: jsonFields.therapeutic_goals,
    intervention_plan: jsonFields.intervention_plan,
  })

  if (error) return { error }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  revalidatePath(`/dashboard/pacientes/${patientId}/historia-clinica`)
  return { error: null }
}