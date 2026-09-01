import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

import { ModulePlaceholder } from '@/components/dashboard/module-placeholder'

export const metadata: Metadata = {
  title: 'Documentos',
  robots: { index: false, follow: false },
}

export default function DocumentsPage() {
  return (
    <ModulePlaceholder
      title="Documentos"
      description="Genera y administra consentimientos y documentos PDF."
      icon={FileText}
      phase="6"
    />
  )
}