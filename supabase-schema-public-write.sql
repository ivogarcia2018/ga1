-- ============================================================================
-- ALTERNATIVA DEMO: escrita publica (SEM autenticacao)
-- Executar APENAS se nao quiseres ativar "Allow anonymous sign-ins".
-- ATENCAO: qualquer pessoa com a chave publica pode inserir/apagar fotos.
-- Nao usar em producao.
-- ============================================================================

-- Tabela: permitir INSERT publico
drop policy if exists "Autenticados podem inserir fotos" on public.photos;
drop policy if exists "Insercao publica (demo)" on public.photos;
create policy "Insercao publica (demo)"
  on public.photos for insert
  to anon, authenticated
  with check (true);

-- Storage: permitir upload publico no bucket
drop policy if exists "Autenticados podem fazer upload" on storage.objects;
drop policy if exists "Upload publico (demo)" on storage.objects;
create policy "Upload publico (demo)"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'photo-gallery');

-- Recarregar cache
notify pgrst, 'reload schema';
