import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { PrintButton } from '@/components/documents/print-button'
import { getReceiptForPrint } from '@/lib/services/payments'
import { formatCop, PAYMENT_METHOD_LABELS } from '@/lib/constants/payments'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Comprobante de pago',
  robots: { index: false, follow: false },
}

export default async function ReceiptPrintPage({
  params,
}: {
  params: Promise<{ receiptId: string }>
}) {
  const { receiptId } = await params
  const receipt = await getReceiptForPrint(receiptId)

  if (!receipt) notFound()

  const payment = receipt.payments
  const patient = payment?.patients ?? null

  return (
    <main className="min-h-dvh bg-ink-100/40 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/dashboard/facturacion"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a facturación
          </Link>
          <PrintButton />
        </div>

        <article className="rounded-3xl border border-beige-100 bg-white p-6 shadow-card sm:p-10 print:rounded-none print:border-0 print:shadow-none">
          <header className="flex flex-wrap items-start justify-between gap-4 border-b border-beige-200 pb-6">
            <div>
              <h1 className="font-sans text-2xl text-ink-900">
                Comprobante de pago
              </h1>
              <p className="mt-1 text-sm text-ink-500">
                Psico. Stephania · Acompañamiento psicológico
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-lg font-semibold text-primary-700">
                {receipt.receipt_number}
              </p>
              <p className="text-sm text-ink-500">
                Emitido el {formatDate(receipt.created_at)}
              </p>
            </div>
          </header>

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-ink-400">Paciente</p>
              <p className="font-medium text-ink-900">
                {patient?.full_name ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Documento</p>
              <p className="font-medium text-ink-900">
                {patient?.document_type
                  ? `${patient.document_type} ${patient.document_number ?? ''}`
                  : patient?.document_number ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Servicio</p>
              <p className="font-medium text-ink-900">
                {payment?.services?.name ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Fecha de pago</p>
              <p className="font-medium text-ink-900">
                {payment ? formatDate(payment.payment_date) : '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Método de pago</p>
              <p className="font-medium text-ink-900">
                {payment?.method ? PAYMENT_METHOD_LABELS[payment.method] : '—'}
              </p>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-beige-200">
            <div className="flex items-center justify-between bg-beige-100 px-5 py-3 text-sm font-semibold text-ink-700">
              <span>Total a pagar</span>
              <span>—</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm text-ink-600">
                Pago{' '}
                {payment?.status === 'recibido'
                  ? 'recibido'
                  : payment?.status === 'reembolsado'
                    ? 'reembolsado'
                    : 'pendiente'}
              </span>
              <span className="font-sans text-3xl text-ink-900">
                {payment ? formatCop(payment.amount) : '—'}
              </span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-ink-400">
            Este comprobante corresponde al registro interno de pagos de la
            práctica. Conservarlo como soporte del proceso de facturación.
          </p>
        </article>
      </div>
    </main>
  )
}