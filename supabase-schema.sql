-- ============================================================================
-- SCHEMA DA BASE DE DADOS - GALERIA DE FOTOGRAFIAS (PhotoGrid)
-- Executar no SQL Editor do Supabase:
-- https://supabase.com/dashboard/project/umthukcidhsbfxqomzgt/sql/new
-- Idempotente: pode ser executado mais do que uma vez.
-- ============================================================================

-- 1. Extensoes
create extension if not exists "pgcrypto";

-- 2. Tabela de fotografias
create table if not exists public.photos (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  image_url     text not null,
  storage_path  text not null,
  category      text not null default 'geral',
  tags          text[] not null default '{}',
  width         integer,
  height        integer,
  size_bytes    bigint,
  uploaded_by   uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3. Indices
create index if not exists photos_category_idx   on public.photos (category);
create index if not exists photos_created_at_idx on public.photos (created_at desc);

-- 4. Row Level Security na tabela
alter table public.photos enable row level security;

drop policy if exists "Fotos visiveis para todos" on public.photos;
create policy "Fotos visiveis para todos"
  on public.photos for select
  to anon, authenticated
  using (true);

drop policy if exists "Autenticados podem inserir fotos" on public.photos;
create policy "Autenticados podem inserir fotos"
  on public.photos for insert
  to authenticated
  with check (auth.uid() = uploaded_by);

drop policy if exists "Autor pode atualizar a sua foto" on public.photos;
create policy "Autor pode atualizar a sua foto"
  on public.photos for update
  to authenticated
  using (auth.uid() = uploaded_by)
  with check (auth.uid() = uploaded_by);

drop policy if exists "Autor pode eliminar a sua foto" on public.photos;
create policy "Autor pode eliminar a sua foto"
  on public.photos for delete
  to authenticated
  using (auth.uid() = uploaded_by);

-- ============================================================================
-- 5. Storage: bucket publico "photo-gallery"
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'photo-gallery',
  'photo-gallery',
  true,
  10485760, -- 10 MB
  array['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 10485760,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/gif','image/avif'];

-- Leitura publica das imagens
drop policy if exists "Imagens publicas para leitura" on storage.objects;
create policy "Imagens publicas para leitura"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'photo-gallery');

-- Upload: cada utilizador escreve na sua propria pasta <uid>/...
drop policy if exists "Autenticados podem fazer upload" on storage.objects;
create policy "Autenticados podem fazer upload"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photo-gallery'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Autores podem atualizar as suas imagens" on storage.objects;
create policy "Autores podem atualizar as suas imagens"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'photo-gallery'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'photo-gallery'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Autores podem eliminar as suas imagens" on storage.objects;
create policy "Autores podem eliminar as suas imagens"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photo-gallery'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- 6. updated_at automatico
-- ============================================================================
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_photos_updated_at on public.photos;
create trigger update_photos_updated_at
  before update on public.photos
  for each row
  execute function public.update_updated_at_column();

-- ============================================================================
-- 7. Recarregar o cache de schema do PostgREST
-- ============================================================================
notify pgrst, 'reload schema';

-- ============================================================================
-- DEPOIS DE EXECUTAR:
-- 1. Authentication > Sign In / Providers > ativar "Allow anonymous sign-ins"
--    (necessario para o upload funcionar sem login)
-- 2. Storage > Buckets > confirmar que "photo-gallery" esta Public
-- 3. Se nao quiseres ativar sessao anonima, executa antes
--    supabase-schema-public-write.sql (escrita publica, apenas para demo)
-- ============================================================================
