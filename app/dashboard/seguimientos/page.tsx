import type { Metadata } from 'next'
import Link from 'next/link'
import { Files } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { getFollowUpsOverview } from '@/lib/services/patients'
import {
  FOLLOW_UP_STATUS_LABELS,
  jsonFieldToText,
} from '@/lib/constants/patients'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Seguimientos',
  robots: { index: false, follow: false },
}

const statusTones: Record<string, string> = {
  pendiente: 'bg-ink-100 text-ink-700 border-ink-200',
  en_proceso: 'bg-primary-100 text-primary-800 border-primary-200',
  completado: 'bg-sage-100 text-sage-800 border-sage-200',
}

export default async function FollowUpsPage() {
  const followUps = await getFollowUpsOverview()

  const pending = followUps.filter(
    (followUp) => followUp.status !== 'completado',
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-sans text-3xl text-ink-900">Seguimientos</h1>
        <p className="mt-1 text-ink-500">
          {pending} de {followUps.length} seguimientos en curso.
        </p>
      </div>

      {followUps.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <Files className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            Aún no hay seguimientos registrados
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            Los seguimientos se crean desde la ficha de cada paciente.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {followUps.map((followUp) => {
            const goals = jsonFieldToText(followUp.goals)
            return (
              <li
                key={followUp.id}
                className="rounded-2xl border border-beige-100 bg-white p-4 shadow-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <Link
                      href={`/dashboard/pacientes/${followUp.patient_id}`}
                      className="font-sans text-base font-medium text-ink-900 hover:text-primary-700"
                    >
                      {followUp.patients?.full_name ?? 'Paciente sin asignar'}
                    </Link>
                    <p className="text-sm text-ink-500">
                      Seguimiento del {formatDate(followUp.follow_up_date)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full',
                      statusTones[followUp.status] ??
                        'bg-ink-100 text-ink-700 border-ink-200',
                    )}
                  >
                    {FOLLOW_UP_STATUS_LABELS[followUp.status]}
                  </Badge>
                </div>

                {goals || followUp.observations ? (
                  <div className="mt-3 space-y-1.5 rounded-xl bg-beige-100/70 px-4 py-3">
                    {goals ? (
                      <p className="text-sm text-ink-700">
                        <span className="font-medium text-ink-900">Objetivos: </span>
                        {goals}
                      </p>
                    ) : null}
                    {followUp.observations ? (
                      <p className="text-sm text-ink-600">
                        {followUp.observations}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}