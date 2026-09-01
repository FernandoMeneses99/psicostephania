'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  changePaymentStatus,
  generateReceiptAction,
} from '@/app/dashboard/facturacion/actions'
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  formatCop,
  type PaymentMethod,
  type PaymentStatus,
  type PaymentWithDetails,
} from '@/lib/constants/payments'
import { cn, formatDate } from '@/lib/utils'

const statusTones: Record<PaymentStatus, string> = {
  pendiente: 'bg-primary-100 text-primary-800 border-primary-200',
  recibido: 'bg-sage-100 text-sage-800 border-sage-200',
  reembolsado: 'bg-ink-100 text-ink-600 border-ink-200',
}

const flow: Partial<Record<PaymentStatus, PaymentStatus[]>> = {
  pendiente: ['recibido'],
  recibido: ['reembolsado'],
  reembolsado: ['recibido'],
}

export function PaymentItem({ payment }: { payment: PaymentWithDetails }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  async function handleStatus(next: PaymentStatus) {
    setBusy(next)
    setError(null)
    const result = await changePaymentStatus(payment.id, next)
    setBusy(null)
    if (result.error) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  async function handleReceipt() {
    setBusy('receipt')
    setError(null)
    const result = await generateReceiptAction(payment.id)
    setBusy(null)
    if (result.error || !result.receiptId) {
      setError(result.error ?? 'No se pudo generar el comprobante.')
      return
    }
    router.push(`/dashboard/facturacion/comprobante/${result.receiptId}`)
    router.refresh()
  }

  const nextActions = flow[payment.status] ?? []
  const patientName = payment.patients?.full_name ?? 'Paciente sin asignar'

  return (
    <li className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-sans text-base font-medium text-ink-900">
            {patientName}
          </p>
          <p className="text-sm text-ink-500">
            {payment.services?.name ?? 'Sin servicio'} ·{' '}
            {payment.method ? PAYMENT_METHOD_LABELS[payment.method] : 'Método no indicado'} ·{' '}
            {formatDate(payment.payment_date)}
          </p>
          <p className="mt-1 font-sans text-lg text-ink-900">
            {formatCop(payment.amount)}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className={cn('rounded-full', statusTones[payment.status])}>
            {PAYMENT_STATUS_LABELS[payment.status]}
          </Badge>

          <div className="flex flex-wrap justify-end gap-1.5">
            {nextActions.map((next) => (
              <Button
                key={next}
                variant={next === 'recibido' ? 'primary' : 'outline'}
                size="sm"
                disabled={busy !== null}
                onClick={() => handleStatus(next)}
              >
                {busy === next ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  `Marcar ${PAYMENT_STATUS_LABELS[next].toLowerCase()}`
                )}
              </Button>
            ))}

            {payment.receipt_exists && payment.receipt_id ? (
              <Button asChild variant="secondary" size="sm">
                <Link
                  href={`/dashboard/facturacion/comprobante/${payment.receipt_id}`}
                >
                  <FileText className="h-3.5 w-3.5" /> Comprobante
                </Link>
              </Button>
            ) : null}

            {payment.status === 'recibido' && !payment.receipt_exists ? (
              <Button
                variant="outline"
                size="sm"
                disabled={busy !== null}
                onClick={handleReceipt}
              >
                {busy === 'receipt' ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FileText className="h-3.5 w-3.5" />
                )}
                Generar comprobante
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 rounded-xl bg-primary-100 px-4 py-2 text-sm text-primary-800">
          {error}
        </p>
      ) : null}
    </li>
  )
}