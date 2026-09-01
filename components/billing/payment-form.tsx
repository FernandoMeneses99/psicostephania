'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createPaymentAction } from '@/app/dashboard/facturacion/actions'
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants/payments'
import type {
  PaymentMethodInput,
  PaymentStatus,
} from '@/lib/constants/payments'
import type { PatientOption, ServiceOption } from '@/lib/services/appointments'

type PaymentFormProps = {
  patients: PatientOption[]
  services: ServiceOption[]
}

const selectClass =
  'flex h-11 w-full rounded-xl border border-beige-200 bg-white px-4 py-2 text-sm text-ink-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500'

export function PaymentForm({ patients, services }: PaymentFormProps) {
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
    const result = await createPaymentAction({
      patient_id: String(form.get('patient_id') ?? ''),
      service_id: String(form.get('service_id') ?? '') || null,
      amount: Number(form.get('amount') ?? 0),
      payment_date: String(form.get('payment_date') ?? ''),
      method: String(form.get('method') ?? 'efectivo') as PaymentMethodInput,
      status: String(form.get('status') ?? 'recibido') as PaymentStatus,
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
        <Plus className="h-4 w-4" /> Registrar pago
      </Button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Registrar pago"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-floating sm:rounded-3xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-xl text-ink-900">Registrar pago</h2>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="service_id">Servicio</Label>
                <select
                  id="service_id"
                  name="service_id"
                  className={selectClass}
                  defaultValue=""
                >
                  <option value="">Sin servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (COP)</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="1000"
                  required
                  placeholder="120000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_date">Fecha</Label>
                  <Input
                    id="payment_date"
                    name="payment_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="method">Método</Label>
                  <select
                    id="method"
                    name="method"
                    className={selectClass}
                    defaultValue="efectivo"
                  >
{(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethodInput[]).map(
                      (method) => (
                        <option key={method} value={method}>
                          {PAYMENT_METHOD_LABELS[method]}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  name="status"
                  className={selectClass}
                  defaultValue="recibido"
                >
                  {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map(
                    (status) => (
                      <option key={status} value={status}>
                        {PAYMENT_STATUS_LABELS[status]}
                      </option>
                    ),
                  )}
                </select>
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
                  ) : (
                    'Registrar pago'
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