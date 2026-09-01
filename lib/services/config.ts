import { createClient } from '@/lib/supabase/server'
import type {
  ProfileRow,
  ServiceInput,
  ServiceRow,
} from '@/lib/constants/config'

export async function getProfile(): Promise<ProfileRow | null> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function updateProfile(
  fullName: string,
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Sin sesión activa.' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName.trim() })
    .eq('id', user.id)

  if (error) return { error: 'No se pudo actualizar el perfil.' }
  return { error: null }
}

export async function getServices(): Promise<ServiceRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('is_active', { ascending: false })
    .order('name', { ascending: true })

  if (error || !data) return []
  return data
}

export async function createService(
  input: ServiceInput,
): Promise<{ data: ServiceRow | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .insert({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      duration_minutes: input.duration_minutes,
      modality: input.modality,
      is_active: true,
    })
    .select('*')
    .single()

  if (error || !data) return { data: null, error: 'No se pudo crear el servicio.' }
  return { data, error: null }
}

export async function updateService(
  id: string,
  input: ServiceInput,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .update({
      name: input.name.trim(),
      description: input.description?.trim() || null,
      duration_minutes: input.duration_minutes,
      modality: input.modality,
    })
    .eq('id', id)

  if (error) return { error: 'No se pudo actualizar el servicio.' }
  return { error: null }
}

export async function toggleServiceActive(
  id: string,
  isActive: boolean,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('services')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) return { error: 'No se pudo cambiar el estado del servicio.' }
  return { error: null }
}