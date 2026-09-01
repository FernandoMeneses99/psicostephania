import type { Metadata } from 'next'
import { Receipt } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Facturación',
  robots: { index: false, follow: false },
}

export default function BillingPage() {
  return (
    <ModulePlaceholder
      title="Facturación"
      description="Registra pagos, consultas y genera comprobantes internos."
      icon={Receipt}
      phase="7"
    />
  )
}