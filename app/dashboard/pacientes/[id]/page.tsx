import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, FileHeart } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FollowUpsSection } from '@/components/patients/follow-ups-section'
import { PatientForm } from '@/components/patients/patient-form'
import { PatientStatusActions } from '@/components/patients/patient-status-actions'
import { getPatientById } from '@/lib/services/patients'
import { PATIENT_STATUS_LABELS } from '@/lib/constants/patients'
import { cn, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Paciente',
  robots: { index: false, follow: false },
}

const statusTones = {
  activo: 'bg-sage-100 text-sage-800 border-sage-200',
  inactivo: 'bg-beige-200 text-ink-700 border-beige-300',
  archivado: 'bg-ink-100 text-ink-600 border-ink-200',
}

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const patient = await getPatientById(id)

  if (!patient) notFound()

  const infoRows: Array<{ label: string; value: string }> = [
    { label: 'Correo electrónico', value: patient.email || 'No indicado' },
    { label: 'Teléfono', value: patient.phone || 'No indicado' },
    {
      label: 'Documento',
      value: patient.document_type
        ? `${patient.document_type} — ${patient.document_number ?? '—'}`
        : 'No indicado',
    },
    {
      label: 'Fecha de nacimiento',
      value: patient.birth_date ? formatDate(patient.birth_date) : 'No indicada',
    },
    {
      label: 'Registrado el',
      value: formatDate(patient.created_at),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard/pacientes"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a pacientes
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-sans text-3xl text-ink-900">{patient.full_name}</h1>
            <Badge
              variant="outline"
              className={cn('rounded-full', statusTones[patient.status])}
            >
              {PATIENT_STATUS_LABELS[patient.status]}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PatientStatusActions patientId={patient.id} status={patient.status} />
          <PatientForm patient={patient} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="primary" size="sm" className="gap-2 w-full">
                <Link
                  href={`/dashboard/pacientes/${patient.id}/historia-clinica`}
                >
                  <FileHeart className="h-4 w-4" />
                  {patient.clinical_record ? 'Editar historia clínica' : 'Crear historia clínica'}
                </Link>
              </Button>
            </div>

            <dl className="space-y-3">
              {infoRows.map((row) => (
                <div key={row.label}>
                  <dt className="text-sm text-ink-400">{row.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-ink-800">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            {patient.notes ? (
              <div>
                <dt className="text-sm text-ink-400">Notas</dt>
                <p className="mt-1 whitespace-pre-wrap text-sm text-ink-600">
                  {patient.notes}
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <FollowUpsSection patientId={patient.id} items={patient.follow_ups} />
        </div>
      </div>
    </div>
  )
}