import type { Database } from '@/lib/types/database'

export type AppointmentStatus =
  Database['public']['Tables']['appointments']['Row']['status']

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  solicitud_pendiente: 'Solicitud pendiente',
  programada: 'Programada',
  confirmada: 'Confirmada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
  no_asistio: 'No asistió',
}

export type AppointmentWithDetails =
  Database['public']['Tables']['appointments']['Row'] & {
    patients: {
      id: string
      full_name: string
      email: string | null
      phone: string | null
    } | null
    services: {
      id: string
      name: string
      modality: Database['public']['Tables']['services']['Row']['modality']
    } | null
  }

export const APPOINTMENT_MODALITY_LABELS: Record<
  NonNullable<Database['public']['Tables']['services']['Row']['modality']>,
  string
> = {
  presencial: 'Presencial',
  virtual: 'Virtual',
  hibrida: 'Híbrida',
}

/** Acciones contextuales disponibles según el estado actual de la cita. */
export const APPOINTMENT_FLOW: {
  status: AppointmentStatus
  next: Array<AppointmentStatus>
}[] = [
  { status: 'programada', next: ['confirmada', 'cancelada'] },
  { status: 'confirmada', next: ['realizada', 'no_asistio', 'cancelada'] },
  { status: 'cancelada', next: ['programada'] },
  { status: 'no_asistio', next: ['programada'] },
  { status: 'realizada', next: [] },
]

export const DURATION_OPTIONS = [30, 45, 50, 60, 90]