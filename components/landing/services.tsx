import { Clock, MonitorSmartphone, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

type Service = {
  name: string
  description: string
  duration: string
  modality: string
}

// Datos de ejemplo administrables. En una fase posterior estos
// se consumen de la tabla `services` de la base de datos.
const services: Service[] = [
  {
    name: 'Consulta psicológica inicial',
    description:
      'Primer encuentro para conocernos, comprender tu situación y definir juntos el camino a seguir.',
    duration: '60 min',
    modality: 'Virtual',
  },
  {
    name: 'Acompañamiento terapéutico',
    description:
      'Sesiones continuas para trabajar tu proceso con profundidad, cercanía y seguimiento personalizado.',
    duration: '50 min',
    modality: 'Virtual',
  },
  {
    name: 'Orientación para familiares',
    description:
      'Espacio breve y confidencial para acompañar a quienes apoyan el proceso de un ser querido.',
    duration: '30 min',
    modality: 'Virtual',
  },
]

const modalityIcon: Record<string, typeof Users> = {
  Virtual: MonitorSmartphone,
  'Presencial': Users,
}

export function Services() {
  return (
    <section id="servicios" className="bg-beige-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-600">
            Servicios
          </span>
          <h2 className="mt-4 font-sans text-3xl text-balance text-ink-900 sm:text-4xl">
            Acompañamiento pensado para ti
          </h2>
          <p className="mt-4 text-lg text-ink-500">
            Cada proceso es único. Por eso los espacios se ajustan a tu momento
            y a lo que necesitas trabajar.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((service) => {
            const ModalityIcon = modalityIcon[service.modality] ?? Users
            return (
              <Card key={service.name} className="flex flex-col hover:shadow-soft transition-shadow">
                <CardHeader>
                  <Badge variant="secondary" className="self-start">
                    {service.modality}
                  </Badge>
                  <CardTitle className="mt-3 font-sans text-xl">
                    {service.name}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-ink-500">
                    <Clock className="h-4 w-4 text-primary-500" />
                    {service.duration}
                  </span>
                  <ModalityIcon className="h-4 w-4 text-sage-500" />
                </CardFooter>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="#solicitar">Solicitar este servicio</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}