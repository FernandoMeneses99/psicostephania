'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createConsentVersionAction } from '@/app/dashboard/documentos/actions'
import { defaultConsentContent } from '@/lib/constants/documents'
import { cn } from '@/lib/utils'

const fieldClass =
  'flex min-h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500'

export function ConsentVersionForm() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const result = await createConsentVersionAction(
      String(form.get('content') ?? ''),
    )
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> Nueva versión
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Nueva versión del consentimiento"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">
                Nueva versión del consentimiento
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-beige-100"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">
                  Contenido de la versión
                  <span className="font-normal text-ink-400">
                    {' '}
                    (la numeración se asigna automáticamente)
                  </span>
                </Label>
                <textarea
                  id="content"
                  name="content"
                  rows={16}
                  required
                  defaultValue={defaultConsentContent()}
                  className={cn(fieldClass, 'whitespace-pre-wrap')}
                />
              </div>

              {error ? (
                <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  disabled={busy}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                    </>
                  ) : (
                    'Guardar versión'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}