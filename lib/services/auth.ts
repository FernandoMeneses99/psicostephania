import { createClient } from '@/lib/supabase/client'

export type LoginInput = {
  email: string
  password: string
}

export type LoginError = 'invalid_credentials' | 'unknown'

/**
 * Inicia sesión con Supabase Auth.
 * Devuelve null si el inicio de sesión es exitoso, o un error tipado.
 */
export async function signInWithPassword(
  input: LoginInput,
): Promise<{ error: LoginError | null }> {
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (!error) return { error: null }

  if (error.status === 400 || error.code === 'invalid_credentials') {
    return { error: 'invalid_credentials' }
  }

  return { error: 'unknown' }
}

/**
 * Cierra la sesión del usuario.
 */
export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}