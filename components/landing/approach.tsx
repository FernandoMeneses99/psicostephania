import { Compass, HeartHandshake, Leaf } from 'lucide-react'

const principles = [
  {
    icon: Compass,
    title: 'Metodología',
    text: 'Un enfoque humano y reflexivo, ajustado a ti. Cada proceso se diseña según tu historia y tus objetivos.',
  },
  {
    icon: HeartHandshake,
    title: 'Calidez',
    text: 'La relación terapéutica es el centro del proceso. Trabajamos desde la confianza, el respeto y sin juicios.',
  },
  {
    icon: Leaf,
    title: 'Ritmo propio',
    text: 'Tu proceso avanza a tu ritmo. Sin presión, con acompañamiento constante y objetivos claros.',
  },
]

export function Approach() {
  return (
    <section id="enfoque" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Enfoque
          </span>
          <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
            Una forma de acompañar que te hace sentido
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Mi forma de trabajar se basa en tres pilares que sostienen todo el
            proceso terapéutico.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-3xl border border-beige-100 p-8 text-center transition-shadow hover:shadow-soft"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                <p.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-5 font-sans text-xl text-ink-900">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}