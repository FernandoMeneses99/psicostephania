import type { Metadata } from 'next'
import { HeartPulse } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Historias clínicas',
  robots: { index: false, follow: false },
}

export default function ClinicalRecordsPage() {
  return (
    <ModulePlaceholder
      title="Historias clínicas"
      description="Consulta y gestiona la historia clínica psicosocial de cada paciente."
      icon={HeartPulse}
      phase="5"
    />
  )
}