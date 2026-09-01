'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { changeServiceActive } from '@/app/dashboard/configuracion/actions'
import { ServiceForm } from '@/components/settings/service-form'
import {
  SERVICE_MODALITY_LABELS,
  type ServiceRow,
} from '@/lib/constants/config'
import { cn } from '@/lib/utils'

export function ServiceItem({ service }: { service: ServiceRow }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleToggle() {
    if (busy) return
    setBusy(true)
    setError(null)
    const result = await changeServiceActive(service.id, !service.is_active)
    setBusy(false)
    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  const detail: string[] = []
  if (service.duration_minutes) detail.push(`${service.duration_minutes} min`)
  if (service.modality) detail.push(SERVICE_MODALITY_LABELS[service.modality])

  return (
    <li className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-base font-medium text-ink-900">
              {service.name}
            </p>
            <Badge
              variant="outline"
              className={cn(
                'rounded-full',
                service.is_active
                  ? 'bg-sage-100 text-sage-800 border-sage-200'
                  : 'bg-ink-100 text-ink-600 border-ink-200',
              )}
            >
              {service.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          {service.description ? (
            <p className="mt-1 text-sm text-ink-500">{service.description}</p>
          ) : null}
          {detail.length > 0 ? (
            <p className="mt-1 text-sm text-ink-400">{detail.join(' · ')}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          <ServiceForm service={service} />
          <button
            type="button"
            onClick={handleToggle}
            disabled={busy}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors',
              service.is_active
                ? 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                : 'bg-sage-100 text-sage-800 hover:bg-sage-200',
            )}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : service.is_active ? (
              'Desactivar'
            ) : (
              'Activar'
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-xl bg-primary-100 px-4 py-2 text-sm text-primary-800">
          {error}
        </p>
      ) : null}
    </li>
  )
}