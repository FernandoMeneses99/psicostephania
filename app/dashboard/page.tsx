import Link from 'next/link'
import {
  CalendarDays,
  ClipboardList,
  Inbox,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getDashboardMetrics } from '@/lib/services/dashboard'

export default async function DashboardHome() {
  const metrics = await getDashboardMetrics()

  const statCards = [
    {
      label: 'Solicitudes pendientes',
      value: metrics.pendingRequests,
      href: '/dashboard/solicitudes',
      icon: Inbox,
      tone: 'primary',
    },
    {
      label: 'Consultas de hoy',
      value: metrics.todayAppointments,
      href: '/dashboard/agenda',
      icon: CalendarDays,
      tone: 'sage',
    },
    {
      label: 'Pacientes activos',
      value: metrics.activePatients,
      href: '/dashboard/pacientes',
      icon: Users,
      tone: 'beige',
    },
    {
      label: 'Consultas del mes',
      value: metrics.monthAppointments,
      href: '/dashboard/agenda',
      icon: ClipboardList,
      tone: 'ink',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">Hola</h1>
        <p className="mt-1 text-ink-500">
          Este es el resumen de tu semana.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="transition-shadow hover:shadow-soft">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-ink-500">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <p className="font-sans text-4xl text-ink-900">{card.value}</p>
                  <card.icon
                    className={`h-6 w-6 ${
                      card.tone === 'primary'
                        ? 'text-primary-600'
                        : card.tone === 'sage'
                          ? 'text-sage-600'
                          : 'text-ink-400'
                    }`}
                  />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-sans text-xl">Agenda de hoy</CardTitle>
            <CardDescription>
              Tus consultas programadas para hoy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.todayAppointments === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-beige-200 bg-beige-50 px-6 py-10 text-center">
                <CalendarDays className="h-8 w-8 text-ink-400" />
                <p className="text-sm font-medium text-ink-700">
                  No tienes consultas hoy
                </p>
                <p className="text-sm text-ink-500">
                  Disfruta el día o agenda nuevas citas desde la agenda.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/dashboard/agenda">Ver agenda</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-sans text-xl">Acciones rápidas</CardTitle>
            <CardDescription>Atajos para tu día a día.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/solicitudes">
                <Inbox className="h-4 w-4" /> Revisar solicitudes
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/pacientes">
                <Users className="h-4 w-4" /> Nuevo paciente
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/agenda">
                <CalendarDays className="h-4 w-4" /> Programar consulta
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}