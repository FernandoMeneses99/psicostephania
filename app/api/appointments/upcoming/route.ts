import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

/**
 * Citas próximas que empiezan dentro de la ventana de aviso.
 * Se usa para el polling de notificaciones de la psicóloga.
 */
export async function GET(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const windowMinutes = Math.min(
    240,
    Math.max(1, Number(searchParams.get('window') ?? 30)),
  )

  const now = new Date()
  const windowEnd = new Date(now.getTime() + windowMinutes * 60_000)

  const { data, error } = await supabase
    .from('appointments')
    .select(
      'id, starts_at, status, patients(id, full_name), services(id, name)',
    )
    .in('status', ['programada', 'confirmada'])
    .gte('starts_at', now.toISOString())
    .lt('starts_at', windowEnd.toISOString())
    .order('starts_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al consultar citas' }, { status: 500 })
  }

  return NextResponse.json({ appointments: data ?? [] })
}
