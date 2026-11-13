-- ─── CliniSalud: esquema de base de datos (Supabase / PostgreSQL) ────────────
-- Ejecutá este script en el SQL Editor de tu proyecto de Supabase.

-- ── Roles del sistema ────────────────────────────────────────────────────────
create type rol_usuario as enum ('medico', 'recepcionista', 'enfermeria', 'administrador', 'paciente');

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
  medico_id uuid references medicos (id),
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
  medico_id uuid references medicos (id),
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
  medico_id uuid references medicos (id),
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
  medico_id uuid references medicos (id),
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
  paciente_id uuid references pacientes (id),
  turno_id uuid references turnos (id),
  tipo tipo_notificacion not null default 'general',
  titulo text not null,
  mensaje text not null,
  estado estado_notificacion not null default 'pendiente',
  enviada_en timestamptz,
  created_at timestamptz not null default now()
);

-- ── Facturación y finanzas ───────────────────────────────────────────────────
create type estado_factura as enum ('pendiente', 'pagada', 'vencida', 'anulada');

create table facturas (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes (id),
  consulta_id uuid references consultas (id),
  numero text unique,
  concepto text not null,
  monto numeric(12,2) not null,
  moneda text not null default 'PYG',
  fecha date not null default current_date,
  vencimiento date,
  estado estado_factura not null default 'pendiente',
  metodo_pago text,
  pagada_en timestamptz,
  created_at timestamptz not null default now()
);

-- ── Tareas y avisos internos ─────────────────────────────────────────────────
create type estado_tarea as enum ('pendiente', 'en_progreso', 'completada');

create table tareas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text,
  responsable_id uuid references profiles (id),
  fecha_vencimiento date,
  estado estado_tarea not null default 'pendiente',
  created_at timestamptz not null default now()
);

create table avisos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  mensaje text not null,
  para_rol rol_usuario,
  autor_id uuid references profiles (id),
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
alter table facturas enable row level security;
alter table tareas enable row level security;
alter table avisos enable row level security;

create policy "ver perfil propio" on profiles
  for select using (auth.uid() = id);
create policy "actualizar perfil propio" on profiles
  for update using (auth.uid() = id);
create policy "ver perfiles de la clinica" on profiles
  for select to authenticated using (true);

create policy "pacientes para usuarios autenticados" on pacientes
  for all to authenticated using (true) with check (true);
create policy "turnos para usuarios autenticados" on turnos
  for all to authenticated using (true) with check (true);
create policy "consultas para usuarios autenticados" on consultas
  for all to authenticated using (true) with check (true);
create policy "recetas para usuarios autenticados" on recetas
  for all to authenticated using (true) with check (true);
create policy "certificados para usuarios autenticados" on certificados
  for all to authenticated using (true) with check (true);
create policy "notificaciones para usuarios autenticados" on notificaciones
  for all to authenticated using (true) with check (true);
create policy "facturas para usuarios autenticados" on facturas
  for all to authenticated using (true) with check (true);
create policy "tareas para usuarios autenticados" on tareas
  for all to authenticated using (true) with check (true);
create policy "avisos para usuarios autenticados" on avisos
  for all to authenticated using (true) with check (true);

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
