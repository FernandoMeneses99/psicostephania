import type { Metadata } from 'next'
import { Receipt } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/billing/payment-form'
import { PaymentItem } from '@/components/billing/payment-item'
import { getPaymentStats, getPayments } from '@/lib/services/payments'
import {
  getPatientOptions,
  getServiceOptions,
} from '@/lib/services/appointments'
import { formatCop } from '@/lib/constants/payments'

export const metadata: Metadata = {
  title: 'Facturación',
  robots: { index: false, follow: false },
}

export default async function BillingPage() {
  const [payments, stats, patients, services] = await Promise.all([
    getPayments(),
    getPaymentStats(),
    getPatientOptions(),
    getServiceOptions(),
  ])

  const statCards = [
    {
      label: 'Recibido este mes',
      value: formatCop(stats.totalMesRecibido),
    },
    {
      label: 'Recibidos este mes',
      value: String(stats.recibidosMes),
    },
    {
      label: 'Pagos pendientes',
      value: String(stats.pendientes),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl text-ink-900">Facturación</h1>
          <p className="mt-1 text-ink-500">
            Registra pagos, consultas y genera comprobantes internos.
          </p>
        </div>
        <PaymentForm patients={patients} services={services} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-ink-500">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-3xl text-ink-900">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <Receipt className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            Aún no hay pagos registrados
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            Registra el primer pago con el botón "Registrar pago" para llevar el
            control de tu facturación.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {payments.map((payment) => (
            <PaymentItem key={payment.id} payment={payment} />
          ))}
        </ul>
      )}
    </div>
  )
}