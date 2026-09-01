import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

type ModulePlaceholderProps = {
  title: string
  description: string
  icon: LucideIcon
  phase?: string
}

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  phase,
}: ModulePlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">{title}</h1>
        <p className="mt-1 text-ink-500">{description}</p>
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-14 text-center">
        <Icon className="h-10 w-10 text-ink-300" />
        <div className="flex items-center gap-2">
          <p className="font-sans text-lg font-medium text-ink-700">
            Este módulo estará disponible próximamente
          </p>
          {phase ? <Badge variant="secondary">Fase {phase}</Badge> : null}
        </div>
        <p className="max-w-sm text-sm text-ink-500">
          Se encuentra en desarrollo como parte de la evolución de la
          plataforma.
        </p>
      </div>
    </div>
  )
}