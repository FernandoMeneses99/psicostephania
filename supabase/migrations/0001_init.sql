-- ============================================================
-- Psico. Stephania — Esquema inicial (migración 0001)
-- ZentroSoft · PostgreSQL / Supabase
-- Convención: UUID PK, created_at, updated_at, RLS por defecto.
-- ============================================================

-- Habilitar extensiones necesarias
create extension if not exists "pgcrypto";

-- ============================================================
-- USUARIOS / PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'staff'
    check (role in ('admin', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SERVICIOS (administrables)
-- ============================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration_minutes int check (duration_minutes > 0),
  modality text check (modality in ('presencial', 'virtual', 'hibrida')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PACIENTES
-- ============================================================
create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  document_type text,
  document_number text,
  birth_date date,
  status text not null default 'activo'
    check (status in ('activo', 'inactivo', 'archivado')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- SOLICITUDES DE ATENCIÓN
-- ============================================================
create table if not exists public.appointment_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  message text,
  preferred_service_id uuid references public.services (id) on delete set null,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'en_revision', 'contactado', 'programada', 'rechazada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_requests_status on public.appointment_requests (status);

-- ============================================================
-- CITAS / AGENDA
-- ============================================================
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  request_id uuid references public.appointment_requests (id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'programada'
    check (status in ('solicitud_pendiente', 'programada', 'confirmada', 'realizada', 'cancelada', 'no_asistio')),
  virtual_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists idx_appointments_patient on public.appointments (patient_id);
create index if not exists idx_appointments_start on public.appointments (starts_at);
create index if not exists idx_appointments_status on public.appointments (status);

-- ============================================================
-- HISTORIA CLÍNICA PSICOSOCIAL
-- ============================================================
create table if not exists public.clinical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  general_info jsonb not null default '{}'::jsonb,
  reason_for_consultation text,
  antecedents jsonb not null default '{}'::jsonb,
  family_context jsonb not null default '{}'::jsonb,
  social_context jsonb not null default '{}'::jsonb,
  initial_evaluation jsonb not null default '{}'::jsonb,
  therapeutic_goals jsonb not null default '{}'::jsonb,
  intervention_plan jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (patient_id)
);

-- ============================================================
-- SESIONES CLÍNICAS
-- ============================================================
create table if not exists public.clinical_sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  appointment_id uuid references public.appointments (id) on delete set null,
  session_date date not null,
  observations text,
  evolution text,
  next_steps text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sessions_patient on public.clinical_sessions (patient_id);

-- ============================================================
-- SEGUIMIENTO TERAPÉUTICO
-- ============================================================
create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  session_id uuid references public.clinical_sessions (id) on delete set null,
  follow_up_date timestamptz not null default now(),
  observations text,
  goals jsonb not null default '{}'::jsonb,
  status text not null default 'pendiente'
    check (status in ('pendiente', 'en_proceso', 'completado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_followups_patient on public.follow_ups (patient_id);

-- ============================================================
-- DOCUMENTOS
-- ============================================================
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients (id) on delete cascade,
  document_type text not null,
  title text not null,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_patient on public.documents (patient_id);

-- ============================================================
-- CONSENTIMIENTO INFORMADO (versionado)
-- ============================================================
create table if not exists public.consent_versions (
  id uuid primary key default gen_random_uuid(),
  version int not null,
  content text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.consents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  consent_version_id uuid references public.consent_versions (id) on delete set null,
  accepted_at timestamptz,
  accepted_by text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_consents_patient on public.consents (patient_id);

-- ============================================================
-- FACTURACIÓN / PAGOS / COMPROBANTES
-- ============================================================
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references public.patients (id) on delete set null,
  service_id uuid references public.services (id) on delete set null,
  amount numeric(12, 2) not null check (amount >= 0),
  payment_date timestamptz not null default now(),
  method text check (method in ('efectivo', 'transferencia', 'tarjeta', 'otro')),
  status text not null default 'recibido'
    check (status in ('pendiente', 'recibido', 'reembolsado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_patient on public.payments (patient_id);

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid references public.payments (id) on delete cascade,
  receipt_number text not null,
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TRIGGERS: updated_at automático
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles', 'services', 'patients', 'appointment_requests',
    'appointments', 'clinical_records', 'clinical_sessions', 'follow_ups',
    'documents', 'consent_versions', 'consents', 'payments', 'receipts'
  ]
  loop
    execute format(
      'create or replace trigger trg_%s_updated_at before update on public.%I
       for each row execute function public.set_updated_at()',
      t, t
    );
  end loop;
end;
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- El MVP es de un solo profesional (admin). Solo el propietario
-- autenticado (su perfil en profiles con rol admin) puede acceder.
-- Los pacientes/visitantes no requieren cuenta.

alter table public.profiles enable row level security;

-- Gestión de perfil: el usuario ve/edita solo su propio perfil.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Tablas clínicas y administrativas: solo el admin autenticado.
-- (Se habilita RLS para cada tabla y se permite acceso a admin.)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'patients', 'appointment_requests',
    'appointments', 'clinical_records', 'clinical_sessions', 'follow_ups',
    'documents', 'consent_versions', 'consents', 'payments', 'receipts'
  ]
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "%s_admin_all" on public.%I
       for all using (public.is_admin()) with check (public.is_admin())',
      t, t
    );
  end loop;
end;
$$;

-- ============================================================
-- TRIGGER: crear perfil automáticamente al registrarse
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    'staff'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Primer usuario registrado asume el rol admin (MVP monousuario).
create or replace function public.promote_first_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.profiles where role = 'admin') = 0 then
    update public.profiles set role = 'admin' where id = new.id;
  end if;
  return new;
end;
$$;

create trigger on_first_user_admin
  after insert on public.profiles
  for each row execute function public.promote_first_user();

-- ============================================================
-- SOLICITUDES PÚBLICAS: el visitante SIN cuenta puede insertar
-- ============================================================
create policy "appointment_requests_public_insert" on public.appointment_requests
  for insert
  to anon, authenticated
  with check (true);

-- ============================================================
-- DATOS INICIALES
-- ============================================================
-- Servicio de ejemplo (administrable). No asume especialidades.
insert into public.services (name, description, duration_minutes, modality)
values
  ('Consulta psicológica inicial', 'Primer encuentro para conocernos y definir tu proceso.', 60, 'virtual'),
  ('Sesión de acompañamiento', 'Espacio continuo para tu proceso terapéutico.', 50, 'virtual')
on conflict do nothing;
