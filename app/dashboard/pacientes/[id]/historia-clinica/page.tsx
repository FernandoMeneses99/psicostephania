import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { ClinicalRecordForm } from '@/components/patients/clinical-record-form'
import { ClinicalRecordPrintable } from '@/components/patients/clinical-record-printable'
import { ExportClinicalRecordButton } from '@/components/patients/export-clinical-record-button'
import { getClinicalRecord, getPatientById } from '@/lib/services/patients'

export const metadata: Metadata = {
  title: 'Historia clínica',
  robots: { index: false, follow: false },
}

export default async function ClinicalRecordPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [patient, record] = await Promise.all([
    getPatientById(id),
    getClinicalRecord(id),
  ])

  if (!patient) notFound()

  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link
              href={`/dashboard/pacientes/${patient.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
            >
              <ArrowLeft className="h-4 w-4" /> Volver al paciente
            </Link>
            <h1 className="mt-2 font-sans text-3xl text-ink-900">
              Historia clínica
            </h1>
            <p className="mt-1 text-ink-500">
              {patient.full_name}
              {patient.clinical_record
                ? ` · Actualizada el ${new Intl.DateTimeFormat('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }).format(new Date(patient.clinical_record.updated_at))}`
                : ' · Aún no creada'}
            </p>
          </div>
          <ExportClinicalRecordButton />
        </div>
      </div>

      <div className="print:hidden">
        <ClinicalRecordForm patient={patient} record={record} />
      </div>

      <ClinicalRecordPrintable patient={patient} record={record} />
    </div>
  )
}