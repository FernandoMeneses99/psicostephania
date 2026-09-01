'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { convertRequestToPatient, updateRequestStatus } from '@/lib/services/requests-admin'
import type { RequestStatus } from '@/lib/constants/requests'

export type RequestActionResult = { error: string | null }

export async function changeRequestStatus(
  id: string,
  status: RequestStatus,
): Promise<RequestActionResult> {
  const { error } = await updateRequestStatus(id, status)

  if (error) {
    return { error: 'No se pudo actualizar el estado de la solicitud.' }
  }

  revalidatePath('/dashboard/solicitudes')
  revalidatePath(`/dashboard/solicitudes/${id}`)

  return { error: null }
}

export async function convertToPatient(
  id: string,
): Promise<RequestActionResult & { patient_id: string | null }> {
  const { data, error } = await convertRequestToPatient(id)

  if (error) return { error, patient_id: null }

  revalidatePath('/dashboard/solicitudes')
  revalidatePath(`/dashboard/solicitudes/${id}`)
  revalidatePath('/dashboard/pacientes')

  return { error: null, patient_id: data?.patient_id ?? null }
}

export async function archiveRequest(id: string) {
  await changeRequestStatus(id, 'rechazada')
  redirect('/dashboard/solicitudes')
}