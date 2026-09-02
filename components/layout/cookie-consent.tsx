'use client'

import * as React from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'

import { Button } from '@/components/ui/button'

const CONSENT_KEY = 'ps-consentimiento-cookies'

export function CookieConsent() {
  const [visible, setVisible] = React.useState(false)

  React.useEffect(() => {
    let value: string | null = null
    try {
      value = localStorage.getItem(CONSENT_KEY)
    } catch {
      /* ignore */
    }
    if (value === 'accepted' || value === 'rejected') {
      setVisible(false)
    } else {
      setVisible(true)
    }
  }, [])

  function decide(choice: 'accepted' | 'rejected') {
    try {
      localStorage.setItem(CONSENT_KEY, choice)
    } catch {
      /* ignore */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-beige-100 bg-white p-4 shadow-floating sm:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <p className="font-sans text-base font-medium text-ink-900">
              Uso de cookies
            </p>
            <p className="mt-1 max-w-2xl text-sm text-ink-500">
              Usamos cookies propias para mantener tu sesión segura y para
              que la página funcione correctamente. Al continuar navegando
              aceptas su uso. Puedes consultar nuestra{' '}
              <Link
                href="/legal/privacidad"
                className="text-primary-700 underline hover:text-primary-800"
              >
                política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => decide('rejected')}>
            Rechazar
          </Button>
          <Button size="sm" onClick={() => decide('accepted')}>
            Aceptar
          </Button>
        </div>
      </div>
    </div>
  )
}
