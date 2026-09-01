import { Badge } from '@/components/ui/badge'
import { RequestForm } from '@/components/landing/request-form'

export function Contact() {
  return (
    <section id="solicitar" className="bg-beige-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
              Solicita tu atención
            </span>
            <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
              Comencemos tu proceso
            </h2>
            <p className="mt-4 text-lg text-ink-500">
              Completa el formulario y te contactaré pronto. Los datos que
              compartas son confidenciales y solo se usan para coordinar tu
              atención.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Badge variant="outline">Confidencial</Badge>
              <Badge variant="outline">Sin compromiso</Badge>
              <Badge variant="outline">Atención cercana</Badge>
            </div>

            <div className="mt-10 rounded-3xl border border-beige-100 bg-white p-6 shadow-card sm:p-8">
              <p className="text-sm font-medium text-ink-900">¿Prefieres otro canal?</p>
              <p className="mt-2 text-sm text-ink-500">
                Escríbeme por{' '}
                <a
                  href="mailto:contacto@psicostephania.com"
                  className="font-medium text-primary-700 hover:underline"
                >
                  contacto@psicostephania.com
                </a>{' '}
                o por mis redes sociales.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-beige-100 bg-white p-6 shadow-floating sm:p-10">
            <RequestForm />
          </div>
        </div>
      </div>
    </section>
  )
}