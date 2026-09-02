import {
  TEXT_JSON_FIELDS,
  jsonFieldToText,
  type ClinicalRecordRow,
  type PatientRow,
} from '@/lib/constants/patients'
import { formatDate } from '@/lib/utils'

function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  }).format(new Date(value))
}

function DocumentRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  if (!value) return null
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-400">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-700">
        {value}
      </p>
    </div>
  )
}

export function ClinicalRecordPrintable({
  patient,
  record,
}: {
  patient: PatientRow
  record: ClinicalRecordRow | null
}) {
  const idNumber =
    patient.document_type && patient.document_number
      ? `${patient.document_type}: ${patient.document_number}`
      : patient.document_number
        ? patient.document_number
        : ''

  return (
    <div className="hidden print:block">
      <div className="mx-auto max-w-3xl p-8">
        <div className="mb-6 border-b-2 border-primary-600 pb-4">
          <h1 className="text-2xl font-bold text-ink-900">
            Historia clínica
          </h1>
          <p className="mt-1 text-sm text-ink-500">Psico. Stephania Barón</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Paciente
            </p>
            <p className="text-base font-medium text-ink-900">{patient.full_name}</p>
          </div>
          {patient.birth_date ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Fecha de nacimiento
              </p>
              <p className="text-sm text-ink-700">{formatDate(patient.birth_date)}</p>
            </div>
          ) : null}
          {idNumber ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Documento
              </p>
              <p className="text-sm text-ink-700">{idNumber}</p>
            </div>
          ) : null}
          {patient.email ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Correo
              </p>
              <p className="text-sm text-ink-700">{patient.email}</p>
            </div>
          ) : null}
          {patient.phone ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Teléfono
              </p>
              <p className="text-sm text-ink-700">{patient.phone}</p>
            </div>
          ) : null}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Última actualización
            </p>
            <p className="text-sm text-ink-700">
              {formatDateTime(record?.updated_at)}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <DocumentRow
            label="Motivo de consulta"
            value={record?.reason_for_consultation ?? ''}
          />
          {TEXT_JSON_FIELDS.map((field) => (
            <DocumentRow
              key={field.key}
              label={field.label}
              value={
                record ? jsonFieldToText(record[field.key as keyof ClinicalRecordRow]) : ''
              }
            />
          ))}
        </div>

        <p className="mt-8 border-t border-beige-200 pt-3 text-xs text-ink-400">
          Documento confidencial de uso profesional. Generado el{' '}
          {formatDateTime(new Date().toISOString())}.
        </p>
      </div>
    </div>
  )
}
