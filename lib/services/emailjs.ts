const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'

export type AppointmentEmailParams = {
  to_email: string
  patient_name: string
  service_name: string | null
  date: string
  time: string
  modality: string | null
  virtual_link: string | null
  psychologist_name: string
}

/**
 * Envía un correo de confirmación de cita usando la REST API de EmailJS
 * desde el servidor. Devuelve true si el envío fue exitoso.
 */
export async function sendAppointmentConfirmationEmail(
  params: AppointmentEmailParams,
): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID
  const templateId = process.env.EMAILJS_TEMPLATE_ID
  const publicKey = process.env.EMAILJS_PUBLIC_KEY
  const privateKey = process.env.EMAILJS_PRIVATE_KEY

  // Si las credenciales no están configuradas, no lanzamos error: la cita
  // ya quedó creada y el envío del correo es secundario.
  if (!serviceId || !templateId || !publicKey) return false

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: params,
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  // Header requerido por EmailJS para llamadas REST desde el servidor
  // cuando se usa una Private Key.
  if (privateKey) headers['PRIVATE-KEY'] = privateKey

  try {
    const res = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    return res.ok
  } catch {
    return false
  }
}
