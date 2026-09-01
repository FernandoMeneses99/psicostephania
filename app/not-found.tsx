import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-beige-50 px-4 text-center">
      <p className="font-sans text-6xl text-primary-600">404</p>
      <h1 className="font-sans text-3xl text-ink-900">
        No encontramos esta página
      </h1>
      <p className="max-w-md text-ink-500">
        El enlace puede estar mal escrito o la página fue movida. Vuelve al
        inicio para continuar.
      </p>
      <Button asChild>
        <Link href="/">Volver al inicio</Link>
      </Button>
    </main>
  )
}