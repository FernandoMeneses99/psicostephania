import type { Database } from '@/lib/types/database'

export type ConsentVersionRow =
  Database['public']['Tables']['consent_versions']['Row']

export type ConsentRow = Database['public']['Tables']['consents']['Row']

export type ConsentWithVersion = ConsentRow & {
  consent_versions: Pick<ConsentVersionRow, 'version' | 'content' | 'is_active'> | null
}

export type ConsentPrint = ConsentRow & {
  patients: Database['public']['Tables']['patients']['Row'] | null
  consent_versions: Pick<ConsentVersionRow, 'version' | 'content'> | null
}

export function defaultConsentContent(): string {
  return `CONSENTIMIENTO INFORMADO PARA ATENCIÓN PSICOLÓGICA

Yo, {paciente}, mayor de edad, identificado(a) con {documento}, declaro de manera libre, voluntaria y consciente que he sido informado(a) por la Psicóloga Stephania sobre:

1. La naturaleza y alcance del proceso de acompañamiento psicológico.
2. Los objetivos, técnicas y duración aproximada del proceso.
3. Los límites de la confidencialidad y los casos en los que, por disposición legal, se debe informar a terceros o autoridades.
4. Que la información consignada en mi historia clínica es de carácter reservado.
5. Mi derecho a suspender o terminar el proceso cuando lo considere conveniente.

En consecuencia, autorizo la realización de sesiones de atención psicológica y el registro de la información correspondiente en mi historia clínica, así como el diligenciamiento de los instrumentos necesarios para mi proceso terapéutico.`
}