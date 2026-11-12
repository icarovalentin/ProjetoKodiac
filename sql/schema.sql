-- ─── CliniSalud: esquema inicial de base de datos (Supabase / PostgreSQL) ────
-- Ejecutá este script en el SQL Editor de tu proyecto de Supabase.

-- ── Roles del sistema ────────────────────────────────────────────────────────
create type rol_usuario as enum ('medico', 'recepcionista', 'enfermeria', 'administrador');

-- ── Perfiles de usuarios (uno por cada usuario de Supabase Auth) ─────────────
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_completo text not null,
  rol rol_usuario not null default 'recepcionista',
  telefono text,
  cedula_identidad text,
  created_at timestamptz not null default now()
);

-- ── Médicos (datos profesionales para recetas y certificados) ────────────────
create table medicos (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  especialidad text not null,
  registro_profesional text not null,
  activo boolean not null default true
);

-- ── Pacientes ────────────────────────────────────────────────────────────────
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  cedula_identidad text unique,
  fecha_nacimiento date,
  telefono text,
  email text,
  direccion text,
  sangre_tipo text,
  alergias text,
  created_at timestamptz not null default now()
);

-- ── Agenda de turnos ─────────────────────────────────────────────────────────
create type estado_turno as enum ('pendiente', 'confirmado', 'sala_espera', 'atendido', 'cancelado', 'ausente');

create table turnos (
  id uuid primary key default gen_random_uuid(),
  medico_id uuid not null references medicos (id),
  paciente_id uuid not null references pacientes (id),
  fecha date not null,
  hora time not null,
  motivo text,
  estado estado_turno not null default 'pendiente',
  sobreturno boolean not null default false,
  created_at timestamptz not null default now(),
  unique (medico_id, fecha, hora)
);

-- ── Historia clínica: consultas ──────────────────────────────────────────────
create table consultas (
  id uuid primary key default gen_random_uuid(),
  turno_id uuid references turnos (id),
  paciente_id uuid not null references pacientes (id),
  medico_id uuid not null references medicos (id),
  fecha timestamptz not null default now(),
  motivo_consulta text,
  sintomas text,
  diagnostico text,
  tratamiento text,
  observaciones text,
  presion_arterial text,
  temperatura numeric(4,1),
  peso_kg numeric(5,1),
  altura_cm numeric(5,1)
);

-- ── Recetas ──────────────────────────────────────────────────────────────────
create table recetas (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid references consultas (id),
  paciente_id uuid not null references pacientes (id),
  medico_id uuid not null references medicos (id),
  fecha date not null default current_date,
  contenido text not null,
  created_at timestamptz not null default now()
);

-- ── Certificados médicos ─────────────────────────────────────────────────────
create type tipo_certificado as enum ('reposo', 'salud', 'otro');

create table certificados (
  id uuid primary key default gen_random_uuid(),
  consulta_id uuid references consultas (id),
  paciente_id uuid not null references pacientes (id),
  medico_id uuid not null references medicos (id),
  tipo tipo_certificado not null default 'reposo',
  fecha date not null default current_date,
  dias_reposo int,
  contenido text not null,
  created_at timestamptz not null default now()
);

-- ── Notificaciones al paciente ───────────────────────────────────────────────
create type tipo_notificacion as enum ('recordatorio_turno', 'resultado', 'informacion_medico', 'general');
create type estado_notificacion as enum ('pendiente', 'enviada', 'leida');

create table notificaciones (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id),
  turno_id uuid references turnos (id),
  tipo tipo_notificacion not null default 'general',
  titulo text not null,
  mensaje text not null,
  estado estado_notificacion not null default 'pendiente',
  enviada_en timestamptz,
  created_at timestamptz not null default now()
);

-- ── Seguridad a nivel de fila (RLS) ──────────────────────────────────────────
alter table profiles enable row level security;
alter table medicos enable row level security;
alter table pacientes enable row level security;
alter table turnos enable row level security;
alter table consultas enable row level security;
alter table recetas enable row level security;
alter table certificados enable row level security;
alter table notificaciones enable row level security;

-- Cada usuario puede ver y actualizar su propio perfil
create policy "ver perfil propio" on profiles
  for select using (auth.uid() = id);
create policy "actualizar perfil propio" on profiles
  for update using (auth.uid() = id);

-- Los usuarios autenticados pueden ver los perfiles (necesario para la agenda)
create policy "ver perfiles de la clinica" on profiles
  for select to authenticated using (true);

-- Pacientes: solo lectura/escritura para usuarios autenticados
create policy "pacientes para usuarios autenticados" on pacientes
  for all to authenticated using (true) with check (true);

-- Turnos, consultas, recetas, certificados: usuarios autenticados
create policy "turnos para usuarios autenticados" on turnos
  for all to authenticated using (true) with check (true);
create policy "consultas para medicos y enfermeria" on consultas
  for all to authenticated using (true) with check (true);
create policy "recetas para usuarios autenticados" on recetas
  for all to authenticated using (true) with check (true);
create policy "certificados para usuarios autenticados" on certificados
  for all to authenticated using (true) with check (true);
create policy "notificaciones para usuarios autenticados" on notificaciones
  for all to authenticated using (true) with check (true);

-- Notificaciones: el rol de servicio puede marcarlas como enviadas (edge function)
create policy "servicio actualiza notificaciones" on notificaciones
  for update to service_role using (true);

-- ── Crear perfil automáticamente al registrarse un usuario ───────────────────
create or replace function public.crear_profile_al_registrarse()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nombre_completo, rol)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre_completo', 'Usuario'), 'recepcionista');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.crear_profile_al_registrarse();
