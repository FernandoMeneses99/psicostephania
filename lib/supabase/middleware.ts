import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import type { Database } from '@/lib/types/database'

/**
 * Crea un cliente de Supabase dentro del middleware y refresca
 * la sesión si es necesario. Devuelve la respuesta actualizada
 * con las cookies de sesión.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data, error } = await supabase.auth
    .getUser()
    .catch(() => ({ data: { user: null }, error: null }))

  if (error) {
    return { supabaseResponse, user: null }
  }

  return { supabaseResponse, user: data.user }
}