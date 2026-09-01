import type { Metadata } from 'next'
import { Inbox } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Solicitudes',
  robots: { index: false, follow: false },
}

export default function RequestsPage() {
  return (
    <ModulePlaceholder
      title="Solicitudes"
      description="Revisa y gestiona las solicitudes de atención de tus pacientes."
      icon={Inbox}
      phase="3"
    />
  )
}