"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Image as ImageIcon, FileText, Camera, CheckCircle2, AlertTriangle } from "lucide-react";

interface UploadFormProps {
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: "geral", label: "Geral" },
  { value: "paisagem", label: "Paisagem" },
  { value: "retrato", label: "Retrato" },
  { value: "arquitetura", label: "Arquitetura" },
  { value: "natureza", label: "Natureza" },
  { value: "urbano", label: "Urbano" },
];

const INPUT =
  "w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400";

export default function UploadForm({ onSuccess }: UploadFormProps = {}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("geral");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = hasSupabaseConfig ? createClient() : null;

  // Garante uma sessao (anonima se nao existir) para satisfazer as politicas RLS.
  async function getUserId(): Promise<string> {
    if (!supabase) throw new Error("Supabase nao configurado (.env.local em falta).");

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) return sessionData.session.user.id;

    const { data, error: authError } = await supabase.auth.signInAnonymously();
    if (authError || !data.user) {
      throw new Error(
        "Nao foi possivel criar uma sessao. Ative Authentication > Sign In / Providers > Allow anonymous sign-ins no Supabase, ou execute supabase-schema-public-write.sql."
      );
    }
    return data.user.id;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase nao configurado. Crie o ficheiro .env.local.");
      return;
    }
    if (!file) {
      setError("Por favor, selecione uma imagem.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("A imagem excede o limite de 10 MB.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const userId = await getUserId();
      const ext = file.name.split(".").pop() ?? "jpg";
      const storagePath = `${userId}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photo-gallery")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("photo-gallery")
        .getPublicUrl(storagePath);

      const { error: dbError } = await supabase.from("photos").insert({
        title: title.trim() || file.name.replace(/\.[^/.]+$/, ""),
        description: description.trim() || null,
        image_url: urlData.publicUrl,
        storage_path: storagePath,
        category,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        size_bytes: file.size,
        uploaded_by: userId,
      });
      if (dbError) throw dbError;

      setSuccess(true);
      setTitle("");
      setDescription("");
      setTags("");
      setCategory("geral");
      setFile(null);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao enviar a fotografia.";
      setError(
        /row-level security/i.test(message)
          ? "Permissao negada pelo Supabase (RLS). Executa o supabase-schema.sql no SQL Editor e ativa o acesso anonimo."
          : message
      );
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Upload concluido!</h3>
        <p className="mt-2 text-gray-500">A tua fotografia foi adicionada a galeria.</p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 px-5 py-2.5 rounded-lg bg-pink-600 text-white font-medium text-sm hover:bg-pink-700 transition-colors"
        >
          Adicionar outra
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!hasSupabaseConfig && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="text-xs text-amber-800">
            <p className="font-semibold text-amber-900 mb-1">Configuracao necessaria</p>
            Cria um ficheiro <code className="bg-amber-100 px-1 rounded">.env.local</code> com{" "}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="photo-title" className="block text-sm font-medium text-gray-700 mb-2">
            Titulo
          </label>
          <input
            id="photo-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titulo da fotografia"
            className={INPUT}
            disabled={!hasSupabaseConfig}
          />
        </div>
        <div>
          <label htmlFor="photo-category" className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            id="photo-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={INPUT}
            disabled={!hasSupabaseConfig}
          >
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="photo-description" className="block text-sm font-medium text-gray-700 mb-2">
          Descricao
        </label>
        <textarea
          id="photo-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Conta-nos sobre esta fotografia..."
          rows={3}
          className={INPUT}
          disabled={!hasSupabaseConfig}
        />
      </div>

      <div>
        <label htmlFor="photo-tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags <span className="text-gray-400 font-normal">(separadas por virgula)</span>
        </label>
        <input
          id="photo-tags"
          type="text"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder="ex: natureza, verao, viagem"
          className={INPUT}
          disabled={!hasSupabaseConfig}
        />
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-pink-300 hover:bg-pink-50/50 transition-colors relative">
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setError(null);
          }}
          aria-label="Selecionar imagem"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          disabled={!hasSupabaseConfig || uploading}
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3">
            <Upload size={22} strokeWidth={2} />
          </div>
          <p className="text-sm font-medium text-gray-900">Clique para selecionar uma imagem</p>
          <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP, GIF, AVIF • Max. 10 MB</p>
        </div>
      </div>

      {file && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <ImageIcon size={15} strokeWidth={1.5} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="text-xs font-medium text-gray-500 hover:text-red-500 shrink-0 ml-3"
          >
            Remover
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3">
          <FileText className="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Erro</p>
            <p className="text-sm text-red-700 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={uploading || !file || !hasSupabaseConfig}
        className="w-full py-3.5 rounded-lg font-semibold text-white bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <Camera size={18} className="animate-pulse" />
            A enviar fotografia...
          </>
        ) : (
          "Publicar Fotografia"
        )}
      </button>
    </form>
  );
}
