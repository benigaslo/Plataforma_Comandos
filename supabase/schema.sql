-- =========================================================================
-- ESQUEMA SQL PARA SUPABASE - PLATAFORMA EDUCATIVA COMANDQUEST
-- Org: https://supabase.com/dashboard/org/bkqxrzvldyrnxehnidex
-- =========================================================================
-- Copia y pega este script completo en el SQL Editor de tu proyecto Supabase.

-- 1. TABLA DE PERFILES (Vinculada a auth.users, con soporte para 1º DAM, 1º DAW y 2º SMR)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null check (role in ('student', 'teacher')) default 'student',
  course text not null check (course in ('1DAM', '1DAW', '2SMR')) default '1DAM',
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  avatar_url text default '⚡',
  completed_exercises text[] not null default '{}',
  badges text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Si la tabla ya existía, actualizar la restricción de 'course' para incluir '1DAW'
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='profiles' and column_name='course') then
    alter table public.profiles add column course text not null check (course in ('1DAM', '1DAW', '2SMR')) default '1DAM';
  else
    alter table public.profiles drop constraint if exists profiles_course_check;
    alter table public.profiles add constraint profiles_course_check check (course in ('1DAM', '1DAW', '2SMR'));
  end if;
end $$;

-- 2. TABLA DE REGISTRO DE ENVÍOS E INTENTOS (Submissions)
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  command_used text not null,
  success boolean not null default false,
  xp_earned integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.submissions enable row level security;

-- Políticas para 'profiles'
create policy "Los usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Todos los usuarios autenticados pueden ver la tabla de clasificación"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Los docentes pueden ver todos los perfiles de alumnos"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );

create policy "Los usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Políticas para 'submissions'
create policy "Los usuarios pueden insertar sus intentos"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "Los usuarios pueden ver sus propios intentos"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Los docentes pueden ver los intentos de todos los alumnos"
  on public.submissions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );

-- 4. TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL CUANDO SE REGISTRA UN USUARIO
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_teacher boolean;
  user_course text;
  assigned_role text;
begin
  is_teacher := coalesce((new.raw_user_meta_data->>'role' = 'teacher'), false);
  assigned_role := case when is_teacher then 'teacher' else coalesce(new.raw_user_meta_data->>'role', 'student') end;
  user_course := coalesce(new.raw_user_meta_data->>'course', '1DAM');

  insert into public.profiles (id, email, full_name, role, course, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned_role,
    user_course,
    case when assigned_role = 'teacher' then '🛡️' else '⚡' end
  )
  on conflict (id) do update set
    role = excluded.role,
    course = excluded.course;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. TRIGGER DE AUTO-CONFIRMACIÓN (Marca confirmados a los usuarios de inmediato sin requerir correo)
create or replace function public.auto_confirm_user()
returns trigger as $$
begin
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_confirm on auth.users;
create trigger on_auth_user_created_confirm
  before insert on auth.users
  for each row execute procedure public.auto_confirm_user();

-- Confirmar de inmediato los usuarios que estuvieran pendientes de confirmar correo:
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;

-- 6. FUNCIÓN RPC PARA QUE EL PROFESOR CREE ALUMNOS O DOCENTES DIRECTAMENTE DESDE LA WEB
create or replace function public.admin_create_student(
  student_email text,
  student_password text,
  student_name text,
  user_role text default 'student',
  student_course text default '1DAM'
) returns json
language plpgsql
security definer
set search_path = public, extensions, auth
as $$
declare
  new_user_id uuid;
begin
  -- Verificar autorización si hay un usuario autenticado (evita que un alumno invoque la RPC)
  if auth.uid() is not null and not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  ) then
    return json_build_object('success', false, 'error', 'No autorizado: solo los docentes pueden dar de alta usuarios');
  end if;

  -- Comprobar si el usuario ya existe
  if exists (select 1 from auth.users where email = student_email) then
    return json_build_object('success', false, 'error', 'El correo ya está registrado en Supabase');
  end if;

  -- Generar nuevo usuario en auth.users
  new_user_id := gen_random_uuid();

  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    student_email,
    crypt(student_password, gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('full_name', student_name, 'role', user_role, 'course', student_course),
    now(),
    now()
  );

  -- Insertar en identities para compatibilidad total con GoTrue/Supabase Auth
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  ) values (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object('sub', new_user_id, 'email', student_email),
    'email',
    student_email,
    now(),
    now(),
    now()
  );

  return json_build_object('success', true, 'user_id', new_user_id);
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;

-- 7. FUNCIÓN RPC PARA QUE EL PROFESOR ELIMINE ALUMNOS O DOCENTES DE LA BASE DE DATOS Y AUTH
create or replace function public.admin_delete_student(
  target_email text,
  target_id uuid default null
) returns json
language plpgsql
security definer
set search_path = public, extensions, auth
as $$
begin
  -- Verificar autorización del docente si hay un usuario autenticado
  if auth.uid() is not null and not exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  ) then
    return json_build_object('success', false, 'error', 'No autorizado: solo los docentes pueden eliminar usuarios');
  end if;

  -- Borrar intentos y progreso de submissions
  delete from public.submissions
  where user_id in (
    select id from public.profiles where email = target_email or (target_id is not null and id = target_id)
  );

  -- Borrar de la tabla profiles
  delete from public.profiles
  where email = target_email or (target_id is not null and id = target_id);

  -- Borrar de auth.identities
  delete from auth.identities
  where identity_data->>'email' = target_email or (target_id is not null and user_id = target_id);

  -- Borrar de auth.users (cascada)
  delete from auth.users
  where email = target_email or (target_id is not null and id = target_id);

  return json_build_object('success', true);
exception when others then
  return json_build_object('success', false, 'error', SQLERRM);
end;
$$;

-- 8. POLÍTICAS DE LECTURA Y BORRADO EN PROFILES
-- Permitir que la pantalla de inicio de sesión pueda listar los alumnos registrados:
drop policy if exists "Permitir lectura publica de perfiles para acceso del aula" on public.profiles;
create policy "Permitir lectura publica de perfiles para acceso del aula"
  on public.profiles for select
  using (true);

-- Permitir borrado directo de perfiles por docentes autenticados:
drop policy if exists "Los docentes pueden eliminar perfiles" on public.profiles;
create policy "Los docentes pueden eliminar perfiles"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );

-- 9. TRIGGER DE SEGURIDAD: EVITAR ESCALADA DE PRIVILEGIOS EN PROFILES
create or replace function public.protect_profile_role()
returns trigger as $$
begin
  if old.role != new.role then
    if not exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    ) then
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists tr_protect_profile_role on public.profiles;
create trigger tr_protect_profile_role
  before update on public.profiles
  for each row execute procedure public.protect_profile_role();

