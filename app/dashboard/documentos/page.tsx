import type { Metadata } from 'next'
import { FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ActivateVersionButton } from '@/components/documents/activate-version-button'
import { ConsentVersionForm } from '@/components/documents/consent-version-form'
import { getConsentVersions } from '@/lib/services/documents'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Documentos',
  robots: { index: false, follow: false },
}

export default async function DocumentsPage() {
  const versions = await getConsentVersions()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-sans text-3xl text-ink-900">Documentos</h1>
          <p className="mt-1 text-ink-500">
            Gestiona el consentimiento informado con control de versiones.
          </p>
        </div>
        <ConsentVersionForm />
      </div>

      <div className="rounded-3xl border border-sage-200 bg-sage-100/60 p-5 text-sm text-sage-900">
        <p className="font-medium">Cómo funciona</p>
        <p className="mt-1">
          La versión marcada como <strong>activa</strong> es la que se firma
          cuando registras un consentimiento desde el perfil de un paciente. Al
          activar una nueva versión, las anteriores dejan de usarse para nuevas
          firmas (el historial firmado se conserva).
        </p>
      </div>

      {versions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-beige-200 bg-white px-6 py-16 text-center">
          <FileText className="h-10 w-10 text-ink-300" />
          <p className="font-sans text-lg font-medium text-ink-700">
            Aún no hay versiones del consentimiento
          </p>
          <p className="max-w-sm text-sm text-ink-500">
            Crea la primera versión con el botón "Nueva versión" y actívala para
            poder registrar firmas de pacientes.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {versions.map((version) => (
            <Card key={version.id}>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="font-sans text-base font-medium text-ink-900">
                      Versión {version.version}
                    </p>
                    {version.is_active ? (
                      <Badge variant="success" className="rounded-full">
                        Activa
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="rounded-full">
                        Inactiva
                      </Badge>
                    )}
                    <p className="text-sm text-ink-400">
                      Creada el {formatDate(version.created_at)}
                    </p>
                  </div>
                  {!version.is_active ? (
                    <ActivateVersionButton id={version.id} />
                  ) : null}
                </div>
                <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-beige-50 p-4 font-sans text-sm leading-relaxed text-ink-600">
                  {version.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}