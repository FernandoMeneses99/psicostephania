'use server'

import { revalidatePath } from 'next/cache'

import {
  createService,
  toggleServiceActive,
  updateProfile,
  updateService,
} from '@/lib/services/config'
import type { ServiceInput } from '@/lib/constants/config'

export type ConfigActionResult = {
  error: string | null
  serviceId?: string | null
}

export async function updateProfileAction(
  fullName: string,
): Promise<ConfigActionResult> {
  if (!fullName.trim()) return { error: 'El nombre es obligatorio.' }
  const { error } = await updateProfile(fullName)
  if (error) return { error }

  revalidatePath('/dashboard/configuracion')
  return { error: null }
}

export async function createServiceAction(
  input: ServiceInput,
): Promise<ConfigActionResult> {
  if (!input.name.trim()) return { error: 'El nombre es obligatorio.' }

  const { data, error } = await createService(input)
  if (error || !data) return { error: error ?? 'No se pudo crear el servicio.' }

  revalidatePath('/dashboard/configuracion')
  revalidatePath('/dashboard')
  return { error: null, serviceId: data.id }
}

export async function updateServiceAction(
  id: string,
  input: ServiceInput,
): Promise<ConfigActionResult> {
  if (!input.name.trim()) return { error: 'El nombre es obligatorio.' }
  const { error } = await updateService(id, input)
  if (error) return { error }

  revalidatePath('/dashboard/configuracion')
  return { error: null }
}

export async function changeServiceActive(
  id: string,
  isActive: boolean,
): Promise<ConfigActionResult> {
  const { error } = await toggleServiceActive(id, isActive)
  if (error) return { error }

  revalidatePath('/dashboard/configuracion')
  revalidatePath('/dashboard')
  return { error: null }
}