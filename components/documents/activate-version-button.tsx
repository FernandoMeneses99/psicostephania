'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { activateConsentVersionAction } from '@/app/dashboard/documentos/actions'

export function ActivateVersionButton({ id }: { id: string }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleActivate() {
    setBusy(true)
    setError(null)
    const result = await activateConsentVersionAction(id)
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant="primary" size="sm" disabled={busy} onClick={handleActivate}>
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Activar
      </Button>
      {error ? (
        <p role="alert" className="text-xs text-primary-800">
          {error}
        </p>
      ) : null}
    </div>
  )
}