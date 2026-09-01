import type { Metadata } from 'next'
import { CalendarDays } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Agenda',
  robots: { index: false, follow: false },
}

export default function AgendaPage() {
  return (
    <ModulePlaceholder
      title="Agenda"
      description="Crea, confirma y gestiona tus consultas en el calendario."
      icon={CalendarDays}
      phase="4"
    />
  )
}