import type { Database } from '@/lib/types/database'

export type RequestStatus =
  Database['public']['Tables']['appointment_requests']['Row']['status']

export const REQUEST_STATUSES: RequestStatus[] = [
  'pendiente',
  'en_revision',
  'contactado',
  'programada',
  'rechazada',
]

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pendiente: 'Pendiente',
  en_revision: 'En revisión',
  contactado: 'Contactado',
  programada: 'Programada',
  rechazada: 'Rechazada',
}

export type RequestWithDetails =
  Database['public']['Tables']['appointment_requests']['Row'] & {
    service_name: string | null
  }