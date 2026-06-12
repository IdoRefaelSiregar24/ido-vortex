-- =========================================================================
-- 1. PEMBUATAN TABEL PROFILES (DENGAN TINGKAT KEAMANAN / RLS)
-- =========================================================================

-- Buat tabel profiles jika belum ada
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  role text not null default 'staff' check (role in ('admin', 'staff', 'manager')),
  created_at timestamp with time zone not null default timezone('utc'::text, now())
);

-- Aktifkan Row Level Security (RLS) jika belum aktif
alter table public.profiles enable row level security;

-- =========================================================================
-- 2. HAMPIRAN FUNGSI BANTU & KEBIJAKAN AKSES (POLICIES)
-- =========================================================================

-- Fungsi untuk memeriksa apakah user saat ini adalah admin
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Kebijakan Select: Drop jika ada, lalu buat baru
drop policy if exists "Allow authenticated select" on public.profiles;
create policy "Allow authenticated select"
  on public.profiles for select
  to authenticated
  using (true);

-- Kebijakan Insert: Drop jika ada, lalu buat baru
drop policy if exists "Allow admin insert" on public.profiles;
create policy "Allow admin insert"
  on public.profiles for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

-- Kebijakan Update: Drop jika ada, lalu buat baru
drop policy if exists "Allow update profile" on public.profiles;
create policy "Allow update profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin(auth.uid()))
  with check (auth.uid() = id or public.is_admin(auth.uid()));

-- Kebijakan Delete: Drop jika ada, lalu buat baru
drop policy if exists "Allow admin delete" on public.profiles;
create policy "Allow admin delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin(auth.uid()));

-- =========================================================================
-- 3. TRIGGER UNTUK HALAMAN REGISTER (SINGKRONISASI DARI AUTH.USERS)
-- =========================================================================

-- Fungsi handle user baru
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: Hapus jika ada, lalu buat baru
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================================
-- 4. SEEDER: BUAT USER ADMIN KELUARGA
-- =========================================================================

-- Aktifkan extension pgcrypto jika belum aktif
create extension if not exists pgcrypto;

-- Script seeder dengan pemeriksaan email unik agar tidak duplikat saat dijalankan ulang
do $$
declare
  admin_id uuid := gen_random_uuid();
  admin_email text := 'admin@apotek.com';
  admin_password text := 'admin12345'; -- Silakan ganti password ini
  admin_name text := 'Admin Apotek Keluarga';
begin
  -- Hapus user lama (jika ada) dari auth.users untuk mereset seeder secara bersih
  -- Ini otomatis menghapus record di public.profiles berkat ON DELETE CASCADE
  delete from auth.users where email = admin_email;
  
  -- Insert ke tabel auth.users
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
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    is_super_admin
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    admin_id,
    'authenticated',
    'authenticated',
    admin_email,
    extensions.crypt(admin_password, extensions.gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    json_build_object('full_name', admin_name, 'role', 'admin')::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    '',
    false
  );

  -- Insert ke tabel auth.identities
  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  values (
    gen_random_uuid(),
    admin_id,
    json_build_object('sub', admin_id, 'email', admin_email)::jsonb,
    'email',
    admin_email,
    now(),
    now(),
    now()
  );

  raise notice 'Seeder berhasil: Admin "%" dengan email "%" telah dibuat.', admin_name, admin_email;
end $$;
