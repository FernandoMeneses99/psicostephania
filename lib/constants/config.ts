import type { Database } from '@/lib/types/database'

export type ServiceRow = Database['public']['Tables']['services']['Row']

export type ServiceModality = NonNullable<ServiceRow['modality']>

export type ProfileRow = Database['public']['Tables']['profiles']['Row']

export const SERVICE_MODALITY_LABELS: Record<ServiceModality, string> = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  hibrida: 'Híbrida',
}

export const MODALITY_OPTIONS: ServiceModality[] = [
  'presencial',
  'virtual',
  'hibrida',
]

export const DURATION_OPTIONS = [30, 45, 60, 90, 120]

export type ServiceInput = {
  name: string
  description: string | null
  duration_minutes: number | null
  modality: ServiceModality | null
}