import type { Metadata } from 'next'
import { Files } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Seguimientos',
  robots: { index: false, follow: false },
}

export default function FollowUpsPage() {
  return (
    <ModulePlaceholder
      title="Seguimientos"
      description="Registra la evolución y el seguimiento terapéutico de tus pacientes."
      icon={Files}
      phase="5"
    />
  )
}