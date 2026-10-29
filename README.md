# PhotoGrid – Galeria de Fotografias Moderna

Galeria de fotografias moderna, responsiva e elegante construída com **Next.js 16**, **Tailwind CSS** e **Supabase**. Desenhada para deploy na **Vercel**.

## 🚀 Funcionalidades

- Grid responsivo de fotografias
- Modal de visualização com detalhes
- Upload de fotografias com barra de progresso
- Armazenamento de imagens no Supabase Storage
- Base de dados PostgreSQL com metadados das fotos
- Design moderno com gradientes, blur e animações suaves
- Totalmente responsivo (mobile-first)
- SEO otimizado com Open Graph
- Pronto para deploy na Vercel

## 🛠️ Tecnologias

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS
- Supabase (Base de dados + Storage + Auth)
- lucide-react (Ícones)
- Vercel (Deploy)

## 🔧 Configuração da Base de Dados (Supabase)

1. Crie um projeto gratuito em supabase.com
2. Vá a SQL Editor e execute o conteúdo do ficheiro supabase-schema.sql
3. Vá a Settings → API e copie:
   - Project URL → NEXT_PUBLIC_SUPABASE_URL
   - Project API Key > anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Crie um ficheiro .env.local na raiz do projeto com esses valores
5. Vá a Storage → Buckets e confirme que o bucket photo-gallery existe e é público

### 1.1 Passos obrigatórios (2 minutos)

**a) Executar o schema**
Abre o SQL Editor do teu projeto:
https://supabase.com/dashboard/project/umthukcidhsbfxqomzgt/sql/new
Cola **todo** o conteúdo de `supabase-schema.sql` e clica **Run**.
Isto cria a tabela `photos`, o bucket `photo-gallery` e as políticas RLS.

**b) Ativar sessão anónima (necessário para o upload)**
Authentication → Sign In / Providers → ativa **Allow anonymous sign-ins** → Save.

> Alternativa sem autenticação (apenas para demo): em vez do passo (b), executa
> `supabase-schema-public-write.sql`. Qualquer pessoa poderá inserir fotos.

**c) Verificar**
```bash
# deve devolver [] (lista vazia) e HTTP 200
curl.exe -s -w "\nHTTP:%{http_code}" "https://umthukcidhsbfxqomzgt.supabase.co/rest/v1/photos?select=id&limit=1" ^
  -H "apikey: sb_publishable_18M3ka_nSZNJT3b-HUC_bw_2CGty6cg" ^
  -H "Authorization: Bearer sb_publishable_18M3ka_nSZNJT3b-HUC_bw_2CGty6cg"
```

## 💻 Desenvolvimento Local

```bash
npm install
cp .env.example .env.local
# Edite .env.local com as suas chaves do Supabase
npm run dev
```

Abra http://localhost:3000

## 📤 Deploy na Vercel (via GitHub)

### 1. Enviar para o GitHub

```bash
git init
git add .
git commit -m "Initial commit: PhotoGrid gallery"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git push -u origin main
```

### 2. Conectar à Vercel

1. Aceda a vercel.com e faça login
2. Clique em "Add New Project"
3. Importe o seu repositório GitHub
4. Em Environment Variables, adicione:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Clique em Deploy

### 3. Variáveis de Ambiente na Vercel

| Chave | Valor |
|-------|-------|
| NEXT_PUBLIC_SUPABASE_URL | https://seu-projeto.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | sua-chave-anon-aqui |

---

Feito com ❤️ usando Next.js, Tailwind CSS e Supabase.