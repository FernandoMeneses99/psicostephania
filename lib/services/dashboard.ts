import { createClient } from '@/lib/supabase/server'

export type DashboardMetrics = {
  pendingRequests: number
  todayAppointments: number
  activePatients: number
  monthAppointments: number
}

/**
 * Consulta las métricas principales del dashboard.
 * Devuelve valores en cero si la consulta falla (p. ej. tablas aún no migradas).
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient()

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const tomorrowStart = new Date(todayStart)
  tomorrowStart.setDate(tomorrowStart.getDate() + 1)

  const [
    pendingRequests,
    todayAppointments,
    activePatients,
    monthAppointments,
  ] = await Promise.all([
    supabase
      .from('appointment_requests')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pendiente'),
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', todayStart.toISOString())
      .lt('starts_at', tomorrowStart.toISOString())
      .in('status', ['programada', 'confirmada']),
    supabase
      .from('patients')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'activo'),
    supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', monthStart.toISOString())
      .in('status', ['realizada', 'confirmada', 'programada']),
  ])

  return {
    pendingRequests: pendingRequests.count ?? 0,
    todayAppointments: todayAppointments.count ?? 0,
    activePatients: activePatients.count ?? 0,
    monthAppointments: monthAppointments.count ?? 0,
  }
}