import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-beige-50"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 sm:px-6 md:pt-24 lg:grid-cols-2 lg:gap-8">
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-xs font-medium text-primary-700">
            Acompañamiento psicológico profesional
          </span>
          <h1 className="mt-6 font-sans text-4xl leading-tight text-balance text-ink-900 sm:text-5xl md:text-6xl">
            Un espacio seguro para cuidar tu{' '}
            <span className="text-primary-600">bienestar emocional</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-500 sm:mx-auto lg:mx-0">
            Confidencial, cercano y personalizado. Te acompaño en cada paso de
            tu proceso con calidez y profesionalismo.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button asChild size="lg">
              <Link href="#solicitar">Solicitar atención</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#enfoque">Conocer mi enfoque</Link>
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-beige-100 bg-white p-3 shadow-floating">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero.png"
              alt="Espacio cálido de consulta psicológica que transmite tranquilidad"
              className="aspect-[4/5] w-full rounded-[2rem] object-cover"
              width={400}
              height={500}
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl bg-white p-4 shadow-soft md:block">
            <p className="text-xs text-ink-500">Confidencialidad</p>
            <p className="font-sans text-sm font-medium text-ink-900">
              Tu privacidad protegida
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
