import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList, FileText, HeartPulse } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { getClinicalRecordsOverview } from '@/lib/services/patients'
import { PATIENT_STATUS_LABELS } from '@/lib/constants/patients'
import { formatDateTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Historias clínicas',
  robots: { index: false, follow: false },
}

export default async function ClinicalRecordsPage() {
  const records = await getClinicalRecordsOverview()

  const withRecord = records.filter((record) => record.record_id).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">Historias clínicas</h1>
        <p className="mt-1 text-ink-500">
          {withRecord} de {records.length} pacientes con historia clínica.
        </p>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <ClipboardList className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            Aún no hay pacientes
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            Crea el primer paciente para comenzar a registrar sus historias
            clínicas.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {records.map((record) => (
            <li
              key={record.patient_id}
              className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'rounded-xl p-2.5',
                      record.record_id
                        ? 'bg-sage-100 text-sage-700'
                        : 'bg-beige-100 text-ink-400',
                    )}
                  >
                    {record.record_id ? (
                      <FileText className="h-5 w-5" />
                    ) : (
                      <HeartPulse className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/dashboard/pacientes/${record.patient_id}`}
                      className="font-sans text-base font-medium text-ink-900 hover:text-primary-700"
                    >
                      {record.patient_name}
                    </Link>
                    <p className="text-sm text-ink-500">
                      {record.record_id
                        ? `Actualizada el ${formatDateTime(record.record_updated_at!)}`
                        : 'Sin historia clínica registrada'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full',
                      record.record_id
                        ? 'bg-sage-100 text-sage-800 border-sage-200'
                        : 'bg-ink-100 text-ink-600 border-ink-200',
                    )}
                  >
                    {record.record_id ? 'Con historia' : 'Sin historia'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="rounded-full bg-beige-100 text-ink-600 border-beige-200"
                  >
                    {PATIENT_STATUS_LABELS[record.patient_status]}
                  </Badge>
                  <Link
                    href={`/dashboard/pacientes/${record.patient_id}/historia-clinica`}
                    className="inline-flex h-8 items-center rounded-full bg-primary-600 px-3 text-xs font-medium text-white hover:bg-primary-700"
                  >
                    Abrir historia
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}