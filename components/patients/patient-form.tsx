'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  createPatientAction,
  updatePatientAction,
} from '@/app/dashboard/pacientes/actions'
import { DOCUMENT_TYPES, type PatientRow } from '@/lib/constants/patients'
import { cn } from '@/lib/utils'

type PatientFormProps = {
  patient?: PatientRow | null
}

const selectClass =
  'flex h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50'

export function PatientForm({ patient }: PatientFormProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const isEdit = !!patient

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const input = {
      full_name: String(form.get('full_name') ?? ''),
      email: String(form.get('email') ?? '').trim() || null,
      phone: String(form.get('phone') ?? '').trim() || null,
      document_type: String(form.get('document_type') ?? '').trim() || null,
      document_number: String(form.get('document_number') ?? '').trim() || null,
      birth_date: String(form.get('birth_date') ?? '').trim() || null,
      notes: String(form.get('notes') ?? '').trim() || null,
    }

    const result = isEdit
      ? await updatePatientAction(patient.id, input)
      : await createPatientAction(input)
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
        <Button variant="outline" onClick={() => setOpen(true)}>
          Editar datos
        </Button>
      ) : (
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo paciente
        </Button>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={isEdit ? 'Editar paciente' : 'Nuevo paciente'}
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">
                {isEdit ? 'Editar paciente' : 'Nuevo paciente'}
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
                <Label htmlFor="full_name">Nombre completo</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={patient?.full_name ?? ''}
                  autoFocus
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={patient?.email ?? ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={patient?.phone ?? ''}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="document_type">Tipo de documento</Label>
                  <select
                    id="document_type"
                    name="document_type"
                    className={selectClass}
                    defaultValue={patient?.document_type ?? ''}
                  >
                    <option value="">Sin especificar</option>
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document_number">Número de documento</Label>
                  <Input
                    id="document_number"
                    name="document_number"
                    defaultValue={patient?.document_number ?? ''}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  defaultValue={patient?.birth_date ?? ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={patient?.notes ?? ''}
                  className={cn(selectClass, 'resize-none py-3')}
                />
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
                    'Crear paciente'
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