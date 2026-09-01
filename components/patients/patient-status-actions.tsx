'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Archive, Loader2, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { changePatientStatus } from '@/app/dashboard/pacientes/actions'
import type { PatientStatus } from '@/lib/constants/patients'

type PatientStatusActionsProps = {
  patientId: string
  status: PatientStatus
}

export function PatientStatusActions({
  patientId,
  status,
}: PatientStatusActionsProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleStatus(next: PatientStatus) {
    setBusy(true)
    setError(null)
    const result = await changePatientStatus(patientId, next)
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  const archived = status === 'archivado'

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant={archived ? 'outline' : 'ghost'}
        size="sm"
        className={!archived ? 'text-primary-700 hover:bg-primary-100' : undefined}
        disabled={busy}
        onClick={() => handleStatus(archived ? 'activo' : 'archivado')}
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : archived ? (
          <RotateCcw className="h-3.5 w-3.5" />
        ) : (
          <Archive className="h-3.5 w-3.5" />
        )}
        {archived ? 'Reactivar' : 'Archivar'}
      </Button>

      {error ? (
        <p role="alert" className="text-sm text-primary-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}