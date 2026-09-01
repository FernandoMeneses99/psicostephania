import { createClient } from '@/lib/supabase/client'

export type AppointmentRequestInput = {
  full_name: string
  email: string
  phone?: string
  message?: string
}

/**
 * Registra una solicitud de atención de un visitante.
 * El paciente no necesita cuenta; la solicitud queda pendiente
 * para revisión de la psicóloga.
 */
export async function submitAppointmentRequest(
  input: AppointmentRequestInput,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('appointment_requests')
    .insert({
      full_name: input.full_name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message ?? null,
    })
    .select('id')
    .single()

  if (error) throw error

  return data
}