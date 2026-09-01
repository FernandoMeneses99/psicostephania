'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createAppointment } from '@/app/dashboard/agenda/actions'
import { DURATION_OPTIONS } from '@/lib/constants/appointments'
import type {
  PatientOption,
  ServiceOption,
} from '@/lib/services/appointments'
import { cn } from '@/lib/utils'

type AppointmentFormProps = {
  patients: PatientOption[]
  services: ServiceOption[]
  defaultDate: string
}

const selectClass =
  'flex h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50'

export function AppointmentForm({
  patients,
  services,
  defaultDate,
}: AppointmentFormProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [duration, setDuration] = React.useState(60)

  function handleServiceChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const service = services.find((s) => s.id === event.target.value)
    if (service?.duration_minutes) setDuration(service.duration_minutes)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const result = await createAppointment({
      patient_id: String(form.get('patient_id') ?? ''),
      service_id: String(form.get('service_id') ?? '') || null,
      date: String(form.get('date') ?? ''),
      start_time: String(form.get('start_time') ?? ''),
      duration_minutes: Number(form.get('duration_minutes') ?? 60),
      virtual_link:
        String(form.get('virtual_link') ?? '').trim() || null,
      notes: String(form.get('notes') ?? '').trim() || null,
    })
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
        <Plus className="h-4 w-4" /> Nueva consulta
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Nueva consulta"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">Nueva consulta</h2>
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
                <Label htmlFor="patient_id">Paciente</Label>
                <select
                  id="patient_id"
                  name="patient_id"
                  required
                  className={selectClass}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecciona un paciente
                  </option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </option>
                  ))}
                </select>
                {patients.length === 0 ? (
                  <p className="text-sm text-ink-400">
                    Aún no hay pacientes registrados. Convierte una solicitud
                    para agendar su primera consulta.
                  </p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_id">Servicio</Label>
                <select
                  id="service_id"
                  name="service_id"
                  className={selectClass}
                  defaultValue=""
                  onChange={handleServiceChange}
                >
                  <option value="">Sin servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    defaultValue={defaultDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_time">Hora</Label>
                  <Input
                    id="start_time"
                    name="start_time"
                    type="time"
                    required
                    defaultValue="09:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_minutes">Duración</Label>
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
                <input type="hidden" name="duration_minutes" value={duration} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="virtual_link">
                  Enlace a videollamada (opcional)
                </Label>
                <Input
                  id="virtual_link"
                  name="virtual_link"
                  type="url"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className={cn(selectClass, 'resize-none py-3')}
                  placeholder="Contexto o preparación de la sesión"
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
                      <Loader2 className="h-4 w-4 animate-spin" /> Creando...
                    </>
                  ) : (
                    'Agendar consulta'
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