import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: '¿Cómo funciona el proceso de solicitud de atención?',
    answer:
      'Completas un formulario breve y confidencial. Reviso tu solicitud y te contacto para coordinar el primer encuentro.',
  },
  {
    question: '¿Las consultas son virtuales?',
    answer:
      'Sí. Las sesiones se realizan por video en un espacio privado y seguro, para que puedas conectarte desde donde te sientas cómodo.',
  },
  {
    question: '¿Mi información está protegida?',
    answer:
      'Sí. La información es confidencial y se maneja con los más altos estándares de privacidad y protección de datos.',
  },
  {
    question: '¿Con qué frecuencia son las sesiones?',
    answer:
      'La frecuencia depende de tu proceso. Puede ser semanal o quincenal, y se ajusta según tus necesidades y objetivos.',
  },
  {
    question: '¿Cómo pago las consultas?',
    answer:
      'Al coordinar tu espacio te indico las opciones de pago disponibles. Si lo necesitas, emito el comprobante correspondiente.',
  },
]

export function Faq() {
  return (
    <section id="preguntas" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Preguntas frecuentes
          </span>
          <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
            Resuelve tus dudas
          </h2>
        </div>

        <div className="mt-10">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}