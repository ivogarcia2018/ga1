"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, Image as ImageIcon, FileText, Camera } from "lucide-react";

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps = {}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("geral");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: "geral", label: "Geral" },
    { value: "paisagem", label: "Paisagem" },
    { value: "retrato", label: "Retrato" },
    { value: "arquitetura", label: "Arquitetura" },
    { value: "natureza", label: "Natureza" },
    { value: "urbano", label: "Urbano" },
  ];

  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = hasSupabaseConfig ? createClient() : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    setFile(selectedFile);
    setError(null);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasSupabaseConfig) {
      setError(
        "Variaveis de ambiente do Supabase nao configuradas. Crie um ficheiro .env.local."
      );
      return;
    }
    if (!file || !supabase) {
      setError("Por favor, selecione uma imagem.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const storagePath = `public/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("photo-gallery")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("photo-gallery")
        .getPublicUrl(storagePath);

      const { error: dbError } = await supabase.from("photos").insert([
        {
          title: title || file.name.replace(/\\.[^/.]+$/, ""),
          description: description || null,
          image_url: urlData.publicUrl,
          storage_path: storagePath,
          category,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          uploaded_by: (await supabase.auth.getUser()).data.user?.id ?? null,
        },
      ]);

      if (dbError) throw dbError;

      setSuccess(true);
      setUploading(false);
      setTimeout(() => {
        setSuccess(false);
        onSuccess?.();
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao fazer upload da fotografia.");
      setUploading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
          <Camera size={32} strokeWidth={2} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Upload concluido!</h3>
        <p className="mt-2 text-gray-500">A sua fotografia foi adicionada à galeria.</p>
        <button
          onClick={() => {
            setSuccess(false);
            setTitle("");
            setDescription("");
            setFile(null);
          }}
          className="mt-6 text-pink-600 font-medium hover:text-pink-700"
        >
          Adicionar outra
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Adicionar Nova Fotografia</h2>
          <p className="mt-2 text-gray-500">Partilhe as suas melhores imagens com o mundo.</p>
        </div>

        {!hasSupabaseConfig && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <h3 className="text-sm font-bold text-amber-900 mb-2">Configuracao Necessaria</h3>
            <p className="text-amber-800 text-xs">
              Crie um ficheiro .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título da fotografia"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                disabled={!hasSupabaseConfig}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as string)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none bg-white transition-all"
                disabled={!hasSupabaseConfig}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descricao</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte-nos sobre esta fotografia..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              disabled={!hasSupabaseConfig}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (separadas por virgula)</label>
            <input
              type="text"
              value={tags}
              onChange={handleTagsChange}
              placeholder="ex: natureza, verao, viagem"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
              disabled={!hasSupabaseConfig}
            />
            <p className="mt-1 text-xs text-gray-500">Exemplo: paisagem, montanha, por do sol</p>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-pink-300 hover:bg-pink-50 transition-colors relative overflow-hidden">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={!hasSupabaseConfig || !file}
            />
            <div className="flex flex-col items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-3">
                <Upload size={24} strokeWidth={2} />
              </div>
              <p className="text-sm font-medium text-gray-900">Clique para selecionar uma imagem</p>
              <p className="mt-1 text-xs text-gray-500">JPG, PNG, WEBP • Max. 10MB</p>
            </div>
            {file && (
              <div className="mt-4 flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <ImageIcon size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Remover
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro</h3>
                  <div className="mt-0.5 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !file || !hasSupabaseConfig}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${uploading || !file || !hasSupabaseConfig ? "bg-gray-300" : "bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg hover:-translate-y-0.5"}`}
          >
            {uploading ? (
              <>
                <div className="flex items-center justify-between w-full">
                  <span>A fazer upload...</span>
                  <span className="font-mono text-sm">{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-pink-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                </div>
              </>
            ) : (
              "Publicar Fotografia"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

