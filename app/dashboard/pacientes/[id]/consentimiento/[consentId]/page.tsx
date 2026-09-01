import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { PrintButton } from '@/components/documents/print-button'
import { getConsentForPrint } from '@/lib/services/documents'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Consentimiento informado',
  robots: { index: false, follow: false },
}

export default async function ConsentPrintPage({
  params,
}: {
  params: Promise<{ id: string; consentId: string }>
}) {
  const { id, consentId } = await params
  const consent = await getConsentForPrint(consentId)

  if (!consent || consent.patient_id !== id) notFound()

  const patient = consent.patients
  const version = consent.consent_versions
  const acceptedAt = consent.accepted_at

  const documentLabel = patient?.document_type
    ? `${patient.document_type} ${patient.document_number ?? ''}`
    : (patient?.document_number ?? '')

  function renderContent(content: string): string {
    return content
      .replace(/\{paciente\}/gi, patient?.full_name ?? '')
      .replace(/\{documento\}/gi, documentLabel)
      .replace(/\{telefono\}/gi, patient?.phone ?? '')
      .replace(/\{email\}/gi, patient?.email ?? '')
      .replace(/\{fecha\}/gi, acceptedAt ? formatDate(acceptedAt) : '')
  }

  return (
    <main className="min-h-dvh bg-ink-100/40 p-4 sm:p-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href={`/dashboard/pacientes/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> Volver al paciente
          </Link>
          <PrintButton />
        </div>

        <article className="rounded-3xl border border-beige-100 bg-white p-6 shadow-card sm:p-10 print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b border-beige-200 pb-6">
            <h1 className="text-center font-sans text-2xl text-ink-900">
              Consentimiento informado para atención psicológica
            </h1>
            <p className="mt-1 text-center text-sm text-ink-500">
              Psico. Stephania · Versión {version?.version ?? '—'}
            </p>
          </header>

          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-ink-400">Paciente</p>
              <p className="font-medium text-ink-900">{patient?.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-ink-400">Documento</p>
              <p className="font-medium text-ink-900">
                {documentLabel || '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Fecha de nacimiento</p>
              <p className="font-medium text-ink-900">
                {patient?.birth_date ? formatDate(patient.birth_date) : '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Teléfono</p>
              <p className="font-medium text-ink-900">{patient?.phone ?? '—'}</p>
            </div>
            <div>
              <p className="text-ink-400">Correo</p>
              <p className="font-medium text-ink-900">
                {patient?.email ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-ink-400">Fecha de firma</p>
              <p className="font-medium text-ink-900">
                {consent.accepted_at ? formatDate(consent.accepted_at) : '—'}
              </p>
            </div>
          </div>

          <div className="mt-8 whitespace-pre-wrap rounded-2xl bg-beige-50 p-5 font-sans text-sm leading-relaxed text-ink-700">
            {version?.content ? renderContent(version.content) : ''}
          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <div className="border-b border-ink-400 pb-1 text-sm font-medium text-ink-800">
                Firma del paciente
              </div>
              <p className="mt-2 text-sm text-ink-500">
                {patient?.full_name ?? ''}
                <br />({consent.accepted_by ? 'aceptado' : 'pendiente'})
              </p>
            </div>
            <div>
              <div className="border-b border-ink-400 pb-1 text-sm font-medium text-ink-800">
                Firma profesional
              </div>
              <p className="mt-2 text-sm text-ink-500">
                Psic. Stephania
                <br />(
                {consent.accepted_at
                  ? `aceptado el ${formatDate(consent.accepted_at)}`
                  : 'pendiente'}
                )
              </p>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}