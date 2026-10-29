-- ============================================================================
-- SCHEMA DA BASE DE DADOS – GALERIA DE FOTOGRAFIAS
-- Executa este SQL no SQL Editor do teu projeto Supabase
-- ============================================================================

-- 1. Habilitar a extensão UUID (necessária para gerar IDs)
create extension if not exists "uuid-ossp";

-- 2. Tabela de fotografias
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text not null,           -- URL pública da imagem (Storage)
  storage_path text not null,        -- Caminho dentro do bucket
  category text default 'geral',     -- Categoria (paisagem, retrato, etc.)
  tags text[] default '{}',          -- Array de tags
  width integer,                     -- Largura em px
  height integer,                    -- Altura em px
  size_bytes bigint,                 -- Tamanho do ficheiro em bytes
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para consultas rápidas
create index if not exists photos_category_idx on public.photos(category);
create index if not exists photos_created_at_idx on public.photos(created_at desc);

-- 3. Habilitar RLS (Row Level Security)
alter table public.photos enable row level security;

-- Políticas de leitura: qualquer pessoa pode ver as fotografias
create policy "Fotos visíveis para todos"
  on public.photos for select
  using (true);

-- Políticas de inserção: apenas utilizadores autenticados podem adicionar
create policy "Utilizadores autenticados podem inserir fotos"
  on public.photos for insert
  with check (auth.uid() = uploaded_by);

-- Políticas de atualização: apenas o autor pode editar
create policy "Autor pode atualizar a sua foto"
  on public.photos for update
  using (auth.uid() = uploaded_by);

-- Políticas de eliminação: apenas o autor pode eliminar
create policy "Autor pode eliminar a sua foto"
  on public.photos for delete
  using (auth.uid() = uploaded_by);

-- 4. Bucket de Storage para as imagens
insert into storage.buckets (id, name, public)
values ('photo-gallery', 'photo-gallery', true)
on conflict (id) do nothing;

-- Políticas do bucket
create policy "Imagens públicas para leitura"
  on storage.objects for select
  using (bucket_id = 'photo-gallery');

create policy "Utilizadores autenticados podem fazer upload"
  on storage.objects for insert
  with check (bucket_id = 'photo-gallery' and auth.uid()::text = (storage.folder(name))[1]);

create policy "Utilizadores podem atualizar as suas imagens"
  on storage.objects for update
  using (bucket_id = 'photo-gallery' and auth.uid()::text = (storage.folder(name))[1]);

create policy "Utilizadores podem eliminar as suas imagens"
  on storage.objects for delete
  using (bucket_id = 'photo-gallery' and auth.uid()::text = (storage.folder(name))[1]);

-- 5. Função para atualizar o updated_at automaticamente
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_photos_updated_at
  before update on public.photos
  for each row
  execute function public.update_updated_at_column();

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================
-- Após executar este SQL:
-- 1. Vai em Storage > Buckets e confirma que "photo-gallery" está público
-- 2. Copia a URL do projeto e a chave anon (anon key) para o .env.local
-- 3. Executa npm run dev para testar localmente
-- ============================================================================
