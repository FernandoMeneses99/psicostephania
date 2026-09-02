'use client'

export default function AgendaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <p className="font-sans text-lg font-semibold text-red-800">
        Ocurrió un error cargando la agenda
      </p>
      <p className="max-w-xl break-all text-sm text-red-700">
        <code>{error.message}</code>
      </p>
      {error.digest ? (
        <p className="text-xs text-red-500">Digest: {error.digest}</p>
      ) : null}
      <button
        onClick={reset}
        className="rounded-full bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
      >
        Reintentar
      </button>
    </div>
  )
}