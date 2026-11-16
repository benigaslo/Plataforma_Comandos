-- =========================================================================
-- ESQUEMA SQL PARA SUPABASE - PLATAFORMA EDUCATIVA COMANDQUEST
-- Org: https://supabase.com/dashboard/org/bkqxrzvldyrnxehnidex
-- =========================================================================
-- Copia y pega este script completo en el SQL Editor de tu proyecto Supabase.

-- 1. TABLA DE PERFILES (Vinculada a auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null check (role in ('student', 'teacher')) default 'student',
  xp integer not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  avatar_url text default '👨‍💻',
  completed_exercises text[] not null default '{}',
  badges text[] not null default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- 4. TRIGGER PARA CREACIÓN AUTOMÁTICA DE PERFIL CUANDO EL DOCENTE CREA UN USUARIO
create or replace function public.handle_new_user()
returns trigger as $$
declare
  is_teacher boolean;
begin
  -- Si el correo contiene el dominio del profesor o gasensio, asigna rol teacher
  is_teacher := (new.email ilike '%gasensio%' or new.email ilike '%profesor%');

  insert into public.profiles (id, email, full_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case when is_teacher then 'teacher' else 'student' end,
    case when is_teacher then '👨‍🏫' else '👨‍💻' end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Activar trigger sobre auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Comentarios explicativos
comment on table public.profiles is 'Perfiles de alumnos y profesores de ComandQuest con métricas de gamificación.';
comment on table public.submissions is 'Historial de comandos ejecutados e intentos por parte del alumnado.';
