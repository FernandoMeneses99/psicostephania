import type { Database } from '@/lib/types/database'

export type PaymentStatus =
  Database['public']['Tables']['payments']['Row']['status']

export type PaymentMethod =
  Database['public']['Tables']['payments']['Row']['method']

export type PaymentMethodInput = NonNullable<PaymentMethod>

export type PaymentRow = Database['public']['Tables']['payments']['Row']

export type ReceiptRow = Database['public']['Tables']['receipts']['Row']

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pendiente: 'Pendiente',
  recibido: 'Recibido',
  reembolsado: 'Reembolsado',
}

export const PAYMENT_METHOD_LABELS: Record<NonNullable<PaymentMethod>, string> = {
  efectivo: 'Efectivo',
  transferencia: 'Transferencia',
  tarjeta: 'Tarjeta',
  otro: 'Otro',
}

export type PaymentWithDetails = PaymentRow & {
  patients: { id: string; full_name: string } | null
  services: { id: string; name: string } | null
  receipt_id: string | null
  receipt_number: string | null
  receipt_exists: boolean
}

export type ReceiptForPrint = ReceiptRow & {
  payments: (Database['public']['Tables']['payments']['Row'] & {
    patients: Database['public']['Tables']['patients']['Row'] | null
    services: Database['public']['Tables']['services']['Row'] | null
  }) | null
}

export function formatCop(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount).replace(/\u00A0/g, ' ')
}