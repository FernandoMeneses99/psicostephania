import { createClient } from '@/lib/supabase/server'
import type {
  PaymentMethodInput,
  PaymentRow,
  PaymentStatus,
  PaymentWithDetails,
  ReceiptForPrint,
} from '@/lib/constants/payments'

export type PaymentInput = {
  patient_id: string
  service_id: string | null
  amount: number
  payment_date: string
  method: PaymentMethodInput
  status: PaymentStatus
}

export async function getPayments(): Promise<PaymentWithDetails[]> {
  const supabase = await createClient()

  const [paymentsResult, receiptsResult] = await Promise.all([
    supabase
      .from('payments')
      .select('*, patients(id, full_name), services(id, name)')
      .order('payment_date', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('receipts').select('id, payment_id, receipt_number'),
  ])

  if (paymentsResult.error || !paymentsResult.data) return []

  const receiptsByPayment = new Map<string, { id: string; receipt_number: string }>()
  for (const receipt of receiptsResult.data ?? []) {
    if (receipt.payment_id) {
      receiptsByPayment.set(receipt.payment_id, {
        id: receipt.id,
        receipt_number: receipt.receipt_number,
      })
    }
  }

  return paymentsResult.data.map((payment) => {
    const base = payment as unknown as Omit<
      PaymentWithDetails,
      'receipt_id' | 'receipt_number' | 'receipt_exists'
    >
    const receipt = receiptsByPayment.get(payment.id)
    return {
      ...base,
      receipt_id: receipt?.id ?? null,
      receipt_number: receipt?.receipt_number ?? null,
      receipt_exists: !!receipt,
    }
  })
}

export async function createPayment(
  input: PaymentInput,
): Promise<{ data: PaymentRow | null; error: string | null }> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payments')
    .insert({
      patient_id: input.patient_id,
      service_id: input.service_id,
      amount: input.amount,
      payment_date: input.payment_date,
      method: input.method,
      status: input.status,
    })
    .select('*')
    .single()

  if (error || !data) return { data: null, error: 'No se pudo registrar el pago.' }
  return { data, error: null }
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { error } = await supabase.from('payments').update({ status }).eq('id', id)
  if (error) return { error: 'No se pudo actualizar el pago.' }
  return { error: null }
}

export async function createReceipt(
  paymentId: string,
): Promise<{ receiptId: string | null; error: string | null }> {
  const supabase = await createClient()

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('id, status')
    .eq('id', paymentId)
    .single()

  if (paymentError || !payment) {
    return { receiptId: null, error: 'No se encontró el pago.' }
  }

  const { data: existing, error: existingError } = await supabase
    .from('receipts')
    .select('id')
    .eq('payment_id', paymentId)
    .maybeSingle()

  if (!existingError && existing) {
    return { receiptId: existing.id, error: 'Este pago ya tiene comprobante.' }
  }

  const { count } = await supabase
    .from('receipts')
    .select('id', { count: 'exact', head: true })

  const year = new Date().getFullYear()
  const receiptNumber = `REC-${year}-${String((count ?? 0) + 1).padStart(4, '0')}`

  const { data, error } = await supabase
    .from('receipts')
    .insert({ payment_id: paymentId, receipt_number: receiptNumber })
    .select('id')
    .single()

  if (error || !data) {
    return { receiptId: null, error: 'No se pudo generar el comprobante.' }
  }

  return { receiptId: data.id, error: null }
}

export async function getReceiptForPrint(
  receiptId: string,
): Promise<ReceiptForPrint | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('receipts')
    .select(
      '*, payments(*, patients(*), services(*))',
    )
    .eq('id', receiptId)
    .single()

  if (error || !data) return null
  return data as unknown as ReceiptForPrint
}

export async function getPaymentStats(): Promise<{
  totalMesRecibido: number
  pendientes: number
  recibidosMes: number
}> {
  const supabase = await createClient()

  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const [pendientes, recibidosMes, totalMes] = await Promise.all([
    supabase
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pendiente'),
    supabase
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'recibido')
      .gte('payment_date', monthStart.toISOString().slice(0, 10)),
    supabase
      .from('payments')
      .select('amount')
      .eq('status', 'recibido')
      .gte('payment_date', monthStart.toISOString().slice(0, 10)),
  ])

  const total = (totalMes.data ?? []).reduce((acc, p) => acc + (p.amount ?? 0), 0)

  return {
    totalMesRecibido: total,
    pendientes: pendientes.count ?? 0,
    recibidosMes: recibidosMes.count ?? 0,
  }
}