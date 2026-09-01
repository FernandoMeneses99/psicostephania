import Link from 'next/link'
import { Instagram, Mail, Music2, Sparkles } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-beige-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-sans text-xl font-medium text-ink-900">
              Psico·<span className="text-primary-600">Stephania</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-ink-500">
              Acompañamiento psicológico profesional, confidencial y
              personalizado. Un espacio seguro para cuidar tu bienestar
              emocional.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-900">Contacto</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <a
                  href="mailto:contacto@psicostephania.com"
                  className="inline-flex items-center gap-2 hover:text-primary-700"
                >
                  <Mail className="h-4 w-4" /> contacto@psicostephania.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-700"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-700"
                >
                  <Music2 className="h-4 w-4" /> TikTok
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-ink-900">Legal</p>
            <ul className="mt-3 space-y-2 text-sm text-ink-500">
              <li>
                <Link href="/legal/privacidad" className="hover:text-primary-700">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/terminos" className="hover:text-primary-700">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/tratamiento-de-datos"
                  className="hover:text-primary-700"
                >
                  Tratamiento de datos personales
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary-700">
                  Panel profesional
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-beige-100 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Psico. Stephania. Todos los derechos
            reservados.
          </p>
          <p className="inline-flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" /> Hecho con cuidado por ZentroSoft
          </p>
        </div>
      </div>
    </footer>
  )
}
