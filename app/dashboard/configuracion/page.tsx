import type { Metadata } from 'next'
import { Settings } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Configuración',
  robots: { index: false, follow: false },
}

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Configuración"
      description="Personaliza tu perfil, servicios y preferencias de la plataforma."
      icon={Settings}
      phase="8"
    />
  )
}