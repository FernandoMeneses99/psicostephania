import { createClient } from '@/lib/supabase/server'
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_LABELS,
  type RequestStatus,
  type RequestWithDetails,
} from '@/lib/constants/requests'

/**
 * Lista las solicitudes de atención, opcionalmente filtradas por estado.
 * Devuelve la lista vacía si la consulta falla.
 */
export async function getRequestList(
  status?: RequestStatus,
): Promise<RequestWithDetails[]> {
  const supabase = await createClient()

  let query = supabase
    .from('appointment_requests')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const [requestsResult, servicesResult] = await Promise.all([
    query,
    supabase.from('services').select('id, name').eq('is_active', true),
  ])

  if (requestsResult.error || !requestsResult.data) return []

  const services = new Map(
    (servicesResult.data ?? []).map((service) => [service.id, service.name]),
  )

  return requestsResult.data.map((request) => ({
    ...request,
    service_name: request.preferred_service_id
      ? services.get(request.preferred_service_id) ?? null
      : null,
  }))
}

/**
 * Obtiene una solicitud por id junto al nombre del servicio preferido.
 */
export async function getRequestById(
  id: string,
): Promise<RequestWithDetails | null> {
  const supabase = await createClient()

  const [requestResult, servicesResult] = await Promise.all([
    supabase.from('appointment_requests').select('*').eq('id', id).single(),
    supabase.from('services').select('id, name'),
  ])

  if (requestResult.error || !requestResult.data) return null

  const service = servicesResult.data?.find(
    (s) => s.id === requestResult.data.preferred_service_id,
  )

  return { ...requestResult.data, service_name: service?.name ?? null }
}

/**
 * Actualiza el estado de una solicitud.
 */
export async function updateRequestStatus(id: string, status: RequestStatus) {
  const supabase = await createClient()
  return supabase
    .from('appointment_requests')
    .update({ status })
    .eq('id', id)
    .select('id')
    .single()
}

export type ConvertedRequest = {
  request_id: string | null
  patient_id: string | null
}

/**
 * Convierte una solicitud en un paciente activo y marca la solicitud como contactada.
 * No crea cita (se agenda en el módulo de Agenda).
 */
export async function convertRequestToPatient(
  id: string,
): Promise<{ data: ConvertedRequest | null; error: string | null }> {
  const supabase = await createClient()

  const { data: request, error: requestError } = await supabase
    .from('appointment_requests')
    .select('id, full_name, email, phone, message')
    .eq('id', id)
    .single()

  if (requestError || !request) {
    return { data: null, error: 'No se encontró la solicitud.' }
  }

  const { data: existingPatient, error: existingError } = await supabase
    .from('patients')
    .select('id')
    .eq('email', request.email)
    .maybeSingle()

  if (!existingError && existingPatient) {
    await supabase
      .from('appointment_requests')
      .update({ status: 'contactado' })
      .eq('id', id)
    return {
      data: { request_id: id, patient_id: existingPatient.id },
      error: null,
    }
  }

  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .insert({
      full_name: request.full_name,
      email: request.email,
      phone: request.phone,
      notes: request.message,
      status: 'activo',
    })
    .select('id')
    .single()

  if (patientError || !patient) {
    return { data: null, error: 'No se pudo crear el paciente.' }
  }

  const { error: updateError } = await supabase
    .from('appointment_requests')
    .update({ status: 'contactado' })
    .eq('id', id)

  if (updateError) {
    return { data: null, error: 'Paciente creado, pero no se actualizó la solicitud.' }
  }

  return { data: { request_id: id, patient_id: patient.id }, error: null }
}