import type { Metadata } from 'next'
import Link from 'next/link'

import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-beige-50 px-4 py-12">
      <Link
        href="/"
        className="mb-8 font-sans text-2xl font-medium text-ink-900"
      >
        Psico·<span className="text-primary-600">Stephania</span>
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-beige-100 bg-white p-8 shadow-floating sm:p-10">
        <h1 className="font-sans text-2xl text-ink-900">Panel profesional</h1>
        <p className="mt-2 text-sm text-ink-500">
          Accede a tu espacio de gestión. Solo uso profesional.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-400">
        ¿Eres paciente?{' '}
        <Link href="/#solicitar" className="font-medium text-primary-700 hover:underline">
          Solicita atención aquí
        </Link>
      </p>
    </main>
  )
}