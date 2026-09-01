'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Pencil, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createServiceAction,
  updateServiceAction,
} from '@/app/dashboard/configuracion/actions'
import {
  DURATION_OPTIONS,
  MODALITY_OPTIONS,
  SERVICE_MODALITY_LABELS,
  type ServiceInput,
  type ServiceRow,
} from '@/lib/constants/config'
import { cn } from '@/lib/utils'

const fieldClass =
  'flex h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500'

const selectClass = fieldClass

export function ServiceForm({ service }: { service?: ServiceRow | null }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [duration, setDuration] = React.useState<number | null>(
    service?.duration_minutes ?? null,
  )

  const isEdit = !!service

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const input: ServiceInput = {
      name: String(form.get('name') ?? ''),
      description: String(form.get('description') ?? '') || null,
      duration_minutes: duration,
      modality: (String(form.get('modality') ?? '') || null) as ServiceInput['modality'],
    }

    const result = isEdit
      ? await updateServiceAction(service.id, input)
      : await createServiceAction(input)
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
      {isEdit ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-ink-400 hover:bg-beige-100 hover:text-ink-700"
          aria-label={`Editar ${service.name}`}
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo servicio
        </Button>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={isEdit ? 'Editar servicio' : 'Nuevo servicio'}
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">
                {isEdit ? 'Editar servicio' : 'Nuevo servicio'}
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
                <Label htmlFor="name">Nombre del servicio</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={service?.name ?? ''}
                  placeholder="Consulta psicológica inicial"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  defaultValue={service?.description ?? ''}
                  className={cn(selectClass, 'resize-none py-3')}
                />
              </div>

              <div className="space-y-2">
                <Label>Modalidad</Label>
                <div className="flex flex-wrap gap-2">
                  {MODALITY_OPTIONS.map((modality) => (
                    <label
                      key={modality}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                        service?.modality === modality
                          ? 'bg-primary-600 text-white'
                          : 'bg-beige-100 text-ink-600 hover:bg-beige-200',
                      )}
                    >
                      <input
                        type="radio"
                        name="modality"
                        value={modality}
                        defaultChecked={service?.modality === modality}
                        className="sr-only"
                      />
                      {SERVICE_MODALITY_LABELS[modality]}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Duración</Label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDuration(option)}
                      className={cn(
                        'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                        duration === option
                          ? 'bg-primary-600 text-white'
                          : 'bg-beige-100 text-ink-600 hover:bg-beige-200',
                      )}
                    >
                      {option} min
                    </button>
                  ))}
                </div>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800"
                >
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
                  ) : isEdit ? (
                    'Guardar cambios'
                  ) : (
                    'Crear servicio'
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