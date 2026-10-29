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