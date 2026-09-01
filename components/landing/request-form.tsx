'use client'

import * as React from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  submitAppointmentRequest,
  type AppointmentRequestInput,
} from '@/lib/services/requests'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function RequestForm() {
  const [status, setStatus] = React.useState<FormStatus>('idle')
  const [error, setError] = React.useState<string>('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setError('')

    const form = new FormData(event.currentTarget)
    const input: AppointmentRequestInput = {
      full_name: String(form.get('fullName') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      message: String(form.get('message') ?? '').trim(),
    }

    if (!input.full_name || !input.email) {
      setStatus('error')
      setError('Por favor completa tu nombre y correo.')
      return
    }

    try {
      await submitAppointmentRequest(input)
      setStatus('success')
      event.currentTarget.reset()
    } catch {
      setStatus('error')
      setError(
        'No pudimos recibir tu solicitud en este momento. Por favor intenta nuevamente.',
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-sage-100 bg-sage-50 p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-sage-600" />
        <h3 className="mt-4 font-sans text-2xl text-ink-900">
          ¡Solicitud recibida!
        </h3>
        <p className="mt-3 text-sm text-ink-500">
          Gracias por dar este primer paso. Te contactaré muy pronto para
          coordinar tu espacio.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre completo</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Tu nombre"
          required
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (opcional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+57 ..."
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">¿En qué puedo acompañarte?</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Cuéntame brevemente qué te motiva a solicitar este espacio."
          className="flex w-full rounded-xl border border-beige-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
          </>
        ) : (
          'Enviar solicitud'
        )}
      </Button>

      <p className="text-center text-xs text-ink-400">
        Tu información es confidencial y se usa solo para coordinar tu
        atención.
      </p>
    </form>
  )
}