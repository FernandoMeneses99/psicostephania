'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PenLine } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { registerConsentAction } from '@/app/dashboard/documentos/actions'

export function RegisterConsentButton({ patientId }: { patientId: string }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleRegister() {
    setBusy(true)
    setError(null)
    const result = await registerConsentAction(patientId)
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <Button size="sm" className="gap-2" disabled={busy} onClick={handleRegister}>
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <PenLine className="h-4 w-4" />
        )}
        Registrar firma
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-primary-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}