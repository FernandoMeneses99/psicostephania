import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { PatientForm } from '@/components/patients/patient-form'
import { getPatientList } from '@/lib/services/patients'
import { PATIENT_STATUS_LABELS, type PatientStatus } from '@/lib/constants/patients'
import { cn, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pacientes',
  robots: { index: false, follow: false },
}

type SearchParams = Promise<{ q?: string; status?: string }>

const statusFilter = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
  { value: 'archivado', label: 'Archivados' },
]

const statusTones: Record<PatientStatus, string> = {
  activo: 'bg-sage-100 text-sage-800 border-sage-200',
  inactivo: 'bg-beige-200 text-ink-700 border-beige-300',
  archivado: 'bg-ink-100 text-ink-600 border-ink-200',
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { q, status } = await searchParams
  const activeStatus = (status as PatientStatus | undefined) ?? undefined

  const patients = await getPatientList(q, activeStatus)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl text-ink-900">Pacientes</h1>
          <p className="mt-1 text-ink-500">
            Administra los perfiles, historias y seguimientos de tus pacientes.
          </p>
        </div>
        <PatientForm />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <form action="/dashboard/pacientes" className="contents">
              <input
                type="search"
                name="q"
                defaultValue={q ?? ''}
                placeholder="Buscar por nombre, correo, teléfono o documento"
                className="h-11 w-full rounded-xl border border-beige-200 bg-white pl-11 pr-4 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              />
              <input type="hidden" name="status" value={activeStatus ?? ''} />
            </form>
          </div>

          <div className="flex flex-wrap gap-2">
            {statusFilter.map((option) => (
              <a
                key={option.value}
                href={`/dashboard/pacientes?${new URLSearchParams({
                  q: q ?? '',
                  ...(option.value !== 'todos' ? { status: option.value } : {}),
                })}`}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  (activeStatus ?? 'todos') === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-ink-500 hover:bg-beige-100',
                )}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <Users className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            No se encontraron pacientes
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            {q || activeStatus
              ? 'Prueba con otros términos de búsqueda o filtros.'
              : 'Crea tu primer paciente o convierte una solicitud de la landing.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {patients.map((patient) => (
            <Link
              key={patient.id}
              href={`/dashboard/pacientes/${patient.id}`}
              className="group"
            >
              <Card className="transition-shadow hover:shadow-soft">
                <CardContent className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-sans text-base font-medium text-ink-900 group-hover:text-primary-700">
                      {patient.full_name}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn('rounded-full', statusTones[patient.status])}
                    >
                      {PATIENT_STATUS_LABELS[patient.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-ink-500">
                    {patient.email || 'Sin correo'}
                    {patient.phone ? ` · ${patient.phone}` : ''}
                  </p>
                  <p className="text-xs text-ink-400">
                    {patient.document_type
                      ? `${patient.document_type}: ${patient.document_number ?? '—'} · `
                      : ''}
                    Registrado el {formatDate(patient.created_at)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}