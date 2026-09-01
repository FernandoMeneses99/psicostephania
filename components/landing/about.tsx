import Image from 'next/image'

const highlights = [
  'Acompañamiento desde la cercanía y el respeto',
  'Enfoque profesional, sensible y confidencial',
  'Espacio seguro para conversar sin juicios',
]

export function About() {
  return (
    <section id="sobre-mi" className="bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Sobre mí
          </span>
          <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
            Psic. Stephania
          </h2>
          <p className="mt-6 text-lg text-ink-500">
            Psicóloga profesional comprometida con el bienestar emocional de
            cada persona. Mi trabajo parte de la escucha activa, el respeto y
            un profundo cuidado por tu proceso.
          </p>
          <p className="mt-4 text-ink-500">
            Creo espacios seguros en los que puedas explorar lo que te
            atraviesa, entendiendo tu historia, tus fortalezas y lo que
            necesitas cultivar para sentirte mejor.
          </p>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-beige-100 px-4 py-3">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-sage-400"
              aria-hidden
            />
            <p className="text-sm text-ink-500">
              Formación completa disponible próximamente
            </p>
          </div>

          <ul className="mt-6 space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-ink-700"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2.5rem] border border-beige-100 bg-beige-50 p-8 text-center shadow-card">
          <div className="mx-auto h-64 w-56 overflow-hidden rounded-[2rem] border-4 border-white bg-white shadow-soft">
            <Image
              src="/stephania_baron.webp"
              alt="Foto de Psic. Stephania, psicóloga profesional"
              width={640}
              height={800}
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mt-5 font-sans text-xl text-ink-900">
            Psic. Stephania
          </h3>
          <p className="mt-2 text-sm text-ink-500">
            Psicóloga · Bienestar emocional
          </p>
          <p className="mt-4 text-sm leading-relaxed text-ink-500">
            "Acompañar a las personas a reconectarse consigo mismas y con su
            bienestar es lo que da sentido a mi labor."
          </p>
        </div>
      </div>
    </section>
  )
}