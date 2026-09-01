-- ============================================================
-- GRANTS POST-MIGRACION 0001
-- La migracion 0001 habilito RLS y creo politicas, pero no
-- concedio privilegios a los roles de PostgREST. Sin estos
-- GRANT el API devuelve "permission denied for table ..." (42501)
-- tanto para anon como para authenticated.
-- ============================================================

grant usage on schema public to anon, authenticated;

-- Panel (usuario autenticado = la profesional): CRUD total del modulo admin.
grant select, insert, update, delete on public.services,
  public.patients,
  public.appointments,
  public.clinical_records,
  public.clinical_sessions,
  public.follow_ups,
  public.documents,
  public.consent_versions,
  public.consents,
  public.payments,
  public.receipts,
  public.appointment_requests
  to authenticated;

-- Perfil propio: lectura y actualizacion (las politicas RLS restringen
-- la fila a la sesion actual).
grant select, update on public.profiles to authenticated;

-- Landing publica: el visitante sin cuenta puede registrar su solicitud.
grant select, insert on public.appointment_requests to anon;