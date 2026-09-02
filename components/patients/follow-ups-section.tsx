'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  changeFollowUpStatus,
  createFollowUpAction,
} from '@/app/dashboard/pacientes/actions'
import {
  FOLLOW_UP_STATUS_LABELS,
  jsonFieldToText,
  type FollowUpRow,
  type FollowUpStatus,
} from '@/lib/constants/patients'
import { cn, formatDate } from '@/lib/utils'

const selectClass =
  'flex h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500'

const followUpTones: Record<FollowUpStatus, string> = {
  pendiente: 'bg-primary-100 text-primary-800 border-primary-200',
  en_proceso: 'bg-beige-200 text-ink-700 border-beige-300',
  completado: 'bg-sage-100 text-sage-800 border-sage-200',
}

const followUpFlow: Partial<Record<FollowUpStatus, FollowUpStatus[]>> = {
  pendiente: ['en_proceso', 'completado'],
  en_proceso: ['completado', 'pendiente'],
  completado: ['en_proceso'],
}

type FollowUpsSectionProps = {
  patientId: string
  items: FollowUpRow[]
}

export function FollowUpsSection({ patientId, items }: FollowUpsSectionProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [statusBusy, setStatusBusy] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [statusError, setStatusError] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const result = await createFollowUpAction(patientId, {
      follow_up_date: String(form.get('follow_up_date') ?? ''),
      follow_up_time: String(form.get('follow_up_time') ?? '') || null,
      observations: String(form.get('observations') ?? '') || null,
      goals: String(form.get('goals') ?? '') || null,
      status: String(form.get('status') ?? 'pendiente') as FollowUpStatus,
    })
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  async function handleStatus(item: FollowUpRow, next: FollowUpStatus) {
    setStatusBusy(item.id)
    setStatusError(null)
    const result = await changeFollowUpStatus(item.id, patientId, next)
    setStatusBusy(null)
    if (result.error) {
      setStatusError(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-sans text-xl text-ink-900">Seguimientos</h2>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo seguimiento
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-beige-200 bg-beige-50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-ink-700">
            Sin seguimientos registrados
          </p>
          <p className="text-sm text-ink-500">
            Registra la evolución del proceso terapéutico.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    {formatDate(item.follow_up_date)}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">
                    {item.observations || <em className="text-ink-400">Sin observaciones</em>}
                  </p>
                  {item.goals && jsonFieldToText(item.goals) ? (
                    <p className="mt-2 text-sm text-ink-500">
                      <span className="font-medium text-ink-700">Objetivos: </span>
                      {jsonFieldToText(item.goals)}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant="outline"
                    className={cn('rounded-full', followUpTones[item.status])}
                  >
                    {FOLLOW_UP_STATUS_LABELS[item.status]}
                  </Badge>
                  <div className="flex gap-1.5">
                    {(followUpFlow[item.status] ?? []).map((next) => (
                      <Button
                        key={next}
                        variant="outline"
                        size="sm"
                        disabled={statusBusy === item.id}
                        onClick={() => handleStatus(item, next)}
                      >
                        {statusBusy === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          FOLLOW_UP_STATUS_LABELS[next]
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {statusError ? (
        <p role="alert" className="rounded-xl bg-primary-100 px-4 py-2 text-sm text-primary-800">
          {statusError}
        </p>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Nuevo seguimiento"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">Nuevo seguimiento</h2>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="follow_up_date">Fecha</Label>
                  <Input
                    id="follow_up_date"
                    name="follow_up_date"
                    type="date"
                    required
                    defaultValue={new Date()
                      .toISOString()
                      .slice(0, 10)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="follow_up_time">Hora (opcional)</Label>
                  <Input
                    id="follow_up_time"
                    name="follow_up_time"
                    type="time"
                    defaultValue="09:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  name="status"
                  className={selectClass}
                  defaultValue="pendiente"
                >
                  {(Object.keys(FOLLOW_UP_STATUS_LABELS) as FollowUpStatus[]).map(
                    (status) => (
                      <option key={status} value={status}>
                        {FOLLOW_UP_STATUS_LABELS[status]}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observaciones</Label>
                <textarea
                  id="observations"
                  name="observations"
                  rows={4}
                  className={cn(selectClass, 'resize-none py-3')}
                  placeholder="Evolución, hallazgos y avances del proceso"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Objetivos</Label>
                <textarea
                  id="goals"
                  name="goals"
                  rows={2}
                  className={cn(selectClass, 'resize-none py-3')}
                  placeholder="Metas a trabajar en este seguimiento"
                />
              </div>

              {error ? (
                <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={busy}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                    </>
                  ) : (
                    'Registrar seguimiento'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}