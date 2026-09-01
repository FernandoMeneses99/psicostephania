'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfileAction } from '@/app/dashboard/configuracion/actions'
import type { ProfileRow } from '@/lib/constants/config'

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const router = useRouter()
  const [busy, setBusy] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [saved, setSaved] = React.useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setError(null)
    setSaved(false)

    const form = new FormData(event.currentTarget)
    const result = await updateProfileAction(
      String(form.get('full_name') ?? ''),
    )
    setBusy(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSaved(true)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nombre profesional</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          defaultValue={profile.full_name ?? profile.email ?? ''}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input id="email" value={profile.email ?? ''} disabled readOnly />
        <p className="text-xs text-ink-400">
          Se administra desde Supabase Auth.
        </p>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-primary-100 px-4 py-3 text-sm text-primary-800">
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="rounded-xl bg-sage-100 px-4 py-3 text-sm text-sage-900">
          Perfil actualizado.
        </p>
      ) : null}

      <Button type="submit" disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
          </>
        ) : (
          'Guardar perfil'
        )}
      </Button>
    </form>
  )
}