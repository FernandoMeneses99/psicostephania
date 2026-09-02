'use client'

import { FileDown } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ExportClinicalRecordButton() {
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <FileDown className="h-4 w-4" /> Exportar PDF
    </Button>
  )
}
