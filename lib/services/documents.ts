import { createClient } from '@/lib/supabase/server'
import type {
  ConsentPrint,
  ConsentVersionRow,
  ConsentWithVersion,
} from '@/lib/constants/documents'

export async function getConsentVersions(): Promise<ConsentVersionRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consent_versions')
    .select('*')
    .order('version', { ascending: false })

  if (error || !data) return []
  return data
}

export async function getActiveConsentVersion(): Promise<ConsentVersionRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consent_versions')
    .select('*')
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function createConsentVersion(
  content: string,
): Promise<ConsentVersionRow | null> {
  const supabase = await createClient()

  const { data: last } = await supabase
    .from('consent_versions')
    .select('version')
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = (last?.version ?? 0) + 1

  const { data, error } = await supabase
    .from('consent_versions')
    .insert({ version: nextVersion, content, is_active: false })
    .select('*')
    .single()

  if (error || !data) return null
  return data
}

export async function setActiveConsentVersion(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error: resetError } = await supabase
    .from('consent_versions')
    .update({ is_active: false })
    .eq('is_active', true)

  if (resetError) return false

  const { error } = await supabase
    .from('consent_versions')
    .update({ is_active: true })
    .eq('id', id)

  return !error
}

export async function getPatientConsents(
  patientId: string,
): Promise<ConsentWithVersion[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consents')
    .select('*, consent_versions(version, content, is_active)')
    .eq('patient_id', patientId)
    .order('accepted_at', { ascending: false })
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as ConsentWithVersion[]
}

export async function registerPatientConsent(
  patientId: string,
): Promise<{ consentId: string | null; error: string | null }> {
  const supabase = await createClient()

  const [activeResult, patientResult] = await Promise.all([
    supabase
      .from('consent_versions')
      .select('id')
      .eq('is_active', true)
      .maybeSingle(),
    supabase.from('patients').select('id, full_name').eq('id', patientId).single(),
  ])

  if (!activeResult.data) {
    return {
      consentId: null,
      error: 'No hay una versión activa del consentimiento. Actívala en Documentos.',
    }
  }
  if (patientResult.error || !patientResult.data) {
    return { consentId: null, error: 'No se encontró el paciente.' }
  }

  const { data, error } = await supabase
    .from('consents')
    .insert({
      patient_id: patientId,
      consent_version_id: activeResult.data.id,
      accepted_at: new Date().toISOString(),
      accepted_by: patientResult.data.full_name,
      evidence: { via: 'panel' },
    })
    .select('id')
    .single()

  if (error || !data) {
    return { consentId: null, error: 'No se pudo registrar el consentimiento.' }
  }

  return { consentId: data.id, error: null }
}

export async function getConsentForPrint(consentId: string): Promise<ConsentPrint | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('consents')
    .select(
      '*, patients(id, full_name, document_type, document_number, phone, birth_date, email), consent_versions(version, content)',
    )
    .eq('id', consentId)
    .single()

  if (error || !data) return null
  return data as unknown as ConsentPrint
}