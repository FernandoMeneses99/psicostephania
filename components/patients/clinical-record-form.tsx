'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { saveClinicalRecordAction } from '@/app/dashboard/pacientes/[id]/historia-clinica/actions'
import {
  TEXT_JSON_FIELDS,
  jsonFieldToText,
  type ClinicalRecordRow,
  type PatientRow,
} from '@/lib/constants/patients'
import { cn } from '@/lib/utils'

type ClinicalRecordFormProps = {
  patient: PatientRow
  record: ClinicalRecordRow | null
}

const fieldClass =
  'flex min-h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500'

export function ClinicalRecordForm({ patient, record }: ClinicalRecordFormProps) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const fields: Record<string, string> = {}
    for (const field of TEXT_JSON_FIELDS) {
      fields[field.key] = String(form.get(field.key) ?? '')
    }

    const result = await saveClinicalRecordAction(patient.id, {
      reason_for_consultation: String(form.get('reason_for_consultation') ?? '').trim() || null,
      fields,
    })
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-3xl border border-beige-100 bg-white p-6 shadow-card">
        <div className="space-y-2">
          <Label htmlFor="reason_for_consultation">Motivo de consulta</Label>
          <textarea
            id="reason_for_consultation"
            name="reason_for_consultation"
            rows={3}
            className={cn(fieldClass, 'resize-none')}
            placeholder="¿Por qué el paciente busca acompañamiento?"
            defaultValue={record?.reason_for_consultation ?? ''}
          />
        </div>
      </div>

      {TEXT_JSON_FIELDS.map((field) => {
        const value = record ? jsonFieldToText(record[field.key]) : ''
        return (
          <div key={field.key} className="rounded-3xl border border-beige-100 bg-white p-6 shadow-card">
            <div className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <textarea
                id={field.key}
                name={field.key}
                rows={5}
                className={cn(fieldClass, 'resize-y')}
                placeholder={field.placeholder}
                defaultValue={value}
              />
            </div>
          </div>
        )
      })}

      {error ? (
        <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={busy} size="lg">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
            </>
          ) : (
            'Guardar historia clínica'
          )}
        </Button>
      </div>
    </form>
  )
}