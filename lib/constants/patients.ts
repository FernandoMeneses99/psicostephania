import type { Database } from '@/lib/types/database'

export type PatientStatus =
  Database['public']['Tables']['patients']['Row']['status']

export type PatientRow = Database['public']['Tables']['patients']['Row']

export type FollowUpStatus =
  Database['public']['Tables']['follow_ups']['Row']['status']

export type FollowUpRow = Database['public']['Tables']['follow_ups']['Row']

export type ClinicalRecordRow =
  Database['public']['Tables']['clinical_records']['Row']

export const PATIENT_STATUS_LABELS: Record<PatientStatus, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  archivado: 'Archivado',
}

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En proceso',
  completado: 'Completado',
}

export type PatientWithDetails = PatientRow & {
  clinical_record: Pick<ClinicalRecordRow, 'id' | 'updated_at'> | null
  follow_ups: FollowUpRow[]
}

export const DOCUMENT_TYPES = [
  'Cédula de ciudadanía',
  'Tarjeta de identidad',
  'Cédula de extranjería',
  'Pasaporte',
  'Otro',
] as const

export const TEXT_JSON_FIELDS: Array<{
  key:
    | 'general_info'
    | 'antecedents'
    | 'family_context'
    | 'social_context'
    | 'initial_evaluation'
    | 'therapeutic_goals'
    | 'intervention_plan'
  label: string
  placeholder: string
}> = [
  {
    key: 'general_info',
    label: 'Información general',
    placeholder: 'Datos relevantes del paciente para el expediente',
  },
  {
    key: 'antecedents',
    label: 'Antecedentes',
    placeholder: 'Antecedentes personales, familiares y psicológicos',
  },
  {
    key: 'family_context',
    label: 'Contexto familiar',
    placeholder: 'Composición familiar, dinámicas y vínculos',
  },
  {
    key: 'social_context',
    label: 'Contexto social',
    placeholder: 'Red de apoyo, trabajo, educación y comunidad',
  },
  {
    key: 'initial_evaluation',
    label: 'Evaluación inicial',
    placeholder: 'Impresión diagnóstica inicial y observaciones',
  },
  {
    key: 'therapeutic_goals',
    label: 'Objetivos terapéuticos',
    placeholder: 'Metas acordadas con el paciente para el proceso',
  },
  {
    key: 'intervention_plan',
    label: 'Plan de intervención',
    placeholder: 'Estrategias, frecuencia y técnicas a usar',
  },
]

export function jsonFieldToText(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'object' && value !== null && 'text' in value) {
    return String((value as { text: string }).text ?? '')
  }
  if (typeof value === 'string') return value
  return JSON.stringify(value)
}