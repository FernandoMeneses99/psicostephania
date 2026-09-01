'use server'

import { revalidatePath } from 'next/cache'

import {
  createConsentVersion,
  registerPatientConsent,
  setActiveConsentVersion,
} from '@/lib/services/documents'

export type DocumentActionResult = { error: string | null; consentId?: string | null }

export async function createConsentVersionAction(
  content: string,
): Promise<DocumentActionResult> {
  if (!content.trim()) return { error: 'El contenido es obligatorio.' }

  const version = await createConsentVersion(content.trim())
  if (!version) return { error: 'No se pudo guardar la versión.' }

  revalidatePath('/dashboard/documentos')
  return { error: null }
}

export async function activateConsentVersionAction(
  id: string,
): Promise<DocumentActionResult> {
  const ok = await setActiveConsentVersion(id)
  if (!ok) return { error: 'No se pudo activar la versión.' }

  revalidatePath('/dashboard/documentos')
  return { error: null }
}

export async function registerConsentAction(
  patientId: string,
): Promise<DocumentActionResult> {
  const { consentId, error } = await registerPatientConsent(patientId)
  if (error) return { error }

  revalidatePath(`/dashboard/pacientes/${patientId}`)
  revalidatePath('/dashboard/documentos')

  return { error: null, consentId }
}