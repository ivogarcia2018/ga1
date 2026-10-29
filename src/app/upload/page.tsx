"use client";

import UploadForm from "@/components/UploadForm";
import Link from "next/link";


export default function UploadPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm"
          >
            <span>←</span> Voltar à galeria
          </Link>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Fotografia</h1>
          <p className="text-gray-500 mb-6">
            Preencha os detalhes e selecione a imagem que pretende partilhar.
          </p>
          <UploadForm onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
}