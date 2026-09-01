'use server'

import { revalidatePath } from 'next/cache'

import { createPayment, createReceipt, updatePaymentStatus } from '@/lib/services/payments'
import type { PaymentMethodInput, PaymentStatus } from '@/lib/constants/payments'

export type BillingActionResult = { error: string | null; receiptId?: string | null }

export async function createPaymentAction(input: {
  patient_id: string
  service_id: string | null
  amount: number
  payment_date: string
  method: PaymentMethodInput
  status: PaymentStatus
}): Promise<BillingActionResult> {
  if (!input.patient_id) return { error: 'Selecciona un paciente.' }
  if (!Number.isFinite(input.amount) || input.amount <= 0)
    return { error: 'El valor debe ser mayor que cero.' }
  if (!input.payment_date) return { error: 'Indica la fecha del pago.' }

  const { error } = await createPayment(input)
  if (error) return { error }

  revalidatePath('/dashboard/facturacion')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function changePaymentStatus(
  id: string,
  status: PaymentStatus,
): Promise<BillingActionResult> {
  const { error } = await updatePaymentStatus(id, status)
  if (error) return { error }

  revalidatePath('/dashboard/facturacion')
  revalidatePath('/dashboard')
  return { error: null }
}

export async function generateReceiptAction(
  paymentId: string,
): Promise<BillingActionResult> {
  const { receiptId, error } = await createReceipt(paymentId)
  if (error) return { error }

  revalidatePath('/dashboard/facturacion')
  return { error: null, receiptId }
}