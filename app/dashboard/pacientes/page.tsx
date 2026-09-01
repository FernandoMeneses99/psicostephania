import type { Metadata } from 'next'
import { Users } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Pacientes',
  robots: { index: false, follow: false },
}

export default function PatientsPage() {
  return (
    <ModulePlaceholder
      title="Pacientes"
      description="Administra los perfiles, historias y seguimientos de tus pacientes."
      icon={Users}
      phase="3"
    />
  )
}