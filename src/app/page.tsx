"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Photo } from "@/types/database";
import PhotoGrid from "@/components/PhotoGrid";
import UploadForm from "@/components/UploadForm";
import { Image as ImageIcon } from "lucide-react";

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const hasSupabaseConfig =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const supabase = hasSupabaseConfig ? createClient() : null;

  useEffect(() => {
    if (!hasSupabaseConfig) {
      setError(
        "Variaveis de ambiente do Supabase nao configuradas. Crie um ficheiro .env.local com NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      setLoading(false);
      return;
    }
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos((data ?? []) as Photo[]);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar fotografias.");
    } finally {
      setLoading(false);
    }
  }

  const handleUploadSuccess = () => {
    fetchPhotos();
    setShowUpload(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-200" />
          <div className="w-48 h-4 rounded-full bg-gray-200" />
        </div>
        <p className="text-gray-500 text-sm mt-4">A carregar fotografias...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-orange-25 to-red-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-pink-600 text-xl">
              <ImageIcon size={24} strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl tracking-tight">
              Photo<span className="text-pink-600">Grid</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubra e partilhe momentos unicos. Uma galeria de fotografias
            moderna, rapida e elegante, alimentada por Supabase.
          </p>
        </div>
      </div>

      {!hasSupabaseConfig && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <h3 className="text-lg font-bold text-amber-900 mb-2">Configuracao Necessaria</h3>
            <p className="text-amber-800 text-sm mb-4">
              Crie um ficheiro <code className="bg-amber-100 px-2 py-0.5 rounded text-xs font-mono">.env.local</code> na raiz do projeto com as suas chaves do Supabase:
            </p>
            <div className="text-left max-w-md mx-auto space-y-2">
              <div className="bg-amber-100 p-3 rounded-lg text-xs font-mono text-amber-900 overflow-x-auto">
                NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co<br />
                NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
              </div>
              <p className="text-xs text-amber-600 mt-2">
                Obtenha estes valores em: Supabase Dashboard → Settings → API
              </p>
            </div>
          </div>
        </div>
      )}

      {hasSupabaseConfig && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Galeria</h2>
              <p className="text-gray-500">
                {photos.length} fotografia{photos.length !== 1 ? "s" : ""} partilhada{photos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-md hover:shadow-lg"
            >
              <ImageIcon size={18} strokeWidth={2} /> + Adicionar Foto
            </button>
          </div>

          <PhotoGrid photos={photos} />
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowUpload(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Nova Fotografia</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <ImageIcon size={20} strokeWidth={2} />
              </button>
            </div>
            <div className="p-6">
              <UploadForm onSuccess={() => setShowUpload(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

