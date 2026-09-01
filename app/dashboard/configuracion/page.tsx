import type { Metadata } from 'next'
import { Settings2, UserRound } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileForm } from '@/components/settings/profile-form'
import { ServiceForm } from '@/components/settings/service-form'
import { ServiceItem } from '@/components/settings/service-item'
import { getProfile, getServices } from '@/lib/services/config'

export const metadata: Metadata = {
  title: 'Configuración',
  robots: { index: false, follow: false },
}

export default async function SettingsPage() {
  const [profile, services] = await Promise.all([getProfile(), getServices()])

  const activeCount = services.filter((service) => service.is_active).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">Configuración</h1>
        <p className="mt-1 text-ink-500">
          Administra tu perfil profesional y los servicios de consulta.
        </p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0 pb-2">
          <div className="rounded-xl bg-primary-100 p-2.5 text-primary-700">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">Perfil profesional</CardTitle>
            <p className="text-sm text-ink-500">
              Nombre visible en el panel y en la landing.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {profile ? (
            <ProfileForm profile={profile} />
          ) : (
            <p className="text-sm text-ink-500">
              No se pudo cargar el perfil.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-100 p-2.5 text-primary-700">
              <Settings2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Servicios</CardTitle>
              <p className="text-sm text-ink-500">
                {activeCount} de {services.length} servicios activos.
              </p>
            </div>
          </div>
          <ServiceForm />
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm text-ink-500">
              Aún no hay servicios. Crea el primero para habilitarlo en la
              agenda y en facturación.
            </p>
          ) : (
            <ul className="space-y-3">
              {services.map((service) => (
                <ServiceItem key={service.id} service={service} />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}