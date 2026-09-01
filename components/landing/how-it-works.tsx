const steps = [
  {
    number: '1',
    title: 'Solicita atención',
    text: 'Completa un formulario breve y confidencial contándome en qué puedo acompañarte.',
  },
  {
    number: '2',
    title: 'Recibo tu solicitud',
    text: 'Leo tu información con atención y la reviso antes de contactarte.',
  },
  {
    number: '3',
    title: 'Coordinamos tu espacio',
    text: 'Definimos juntos la fecha y hora que mejor se ajusten a tu momento.',
  },
  {
    number: '4',
    title: 'Recibes la confirmación',
    text: 'Te llega un correo con todos los detalles y el enlace de tu consulta.',
  },
  {
    number: '5',
    title: 'Inicias tu proceso',
    text: 'Nos encontramos en tu espacio virtual. Empiezas a caminar tu proceso.',
  },
]

export function HowItWorks() {
  return (
    <section id="proceso" className="bg-beige-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Cómo funciona
          </span>
          <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
            Así inicia tu proceso
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Un camino claro y sencillo para que dar el primer paso sea fácil.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li key={step.number} className="relative">
              <div className="flex flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 font-sans text-lg font-medium text-white shadow-soft">
                  {step.number}
                </span>
                <h3 className="mt-4 font-sans text-lg text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500">{step.text}</p>
              </div>
              {i < steps.length - 1 && (
                <span
                  className="absolute right-[-18px] top-6 hidden h-px w-6 bg-beige-300 lg:block"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}