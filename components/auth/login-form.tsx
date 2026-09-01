'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInWithPassword } from '@/lib/services/auth'

type FormStatus = 'idle' | 'submitting' | 'error'

export function LoginForm() {
  const router = useRouter()
  const [status, setStatus] = React.useState<FormStatus>('idle')
  const [error, setError] = React.useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return

    setStatus('submitting')
    setError('')

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')

    const { error: loginError } = await signInWithPassword({ email, password })

    if (loginError === 'invalid_credentials') {
      setStatus('error')
      setError('El correo o la contraseña no son correctos.')
      return
    }

    if (loginError) {
      setStatus('error')
      setError('No pudimos iniciar sesión. Intenta nuevamente.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          required
          autoComplete="email"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </div>

      {status === 'error' && error ? (
        <p
          role="alert"
          className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Ingresando...
          </>
        ) : (
          'Ingresar'
        )}
      </Button>
    </form>
  )
}