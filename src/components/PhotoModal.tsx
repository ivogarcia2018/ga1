"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/types/database";
import { X, Download, ExternalLink, Calendar, Tag } from "lucide-react";

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-gray-950 border border-white/10 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 p-4 bg-black/40">
          <div className="min-w-0">
            <h2 className="text-white text-lg sm:text-xl font-bold truncate">{photo.title}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} /> {formatDate(photo.created_at)}
              </span>
              <span className="inline-flex items-center gap-1 capitalize">
                <Tag size={12} /> {photo.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={photo.image_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Abrir em novo separador"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <ExternalLink size={16} strokeWidth={1.8} />
            </a>
            <a
              href={photo.image_url}
              download
              title="Descarregar"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <Download size={16} strokeWidth={1.8} />
            </a>
            <button
              type="button"
              onClick={onClose}
              title="Fechar"
              aria-label="Fechar"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="relative flex-1 min-h-0 bg-black">
          <Image
            src={photo.image_url}
            alt={photo.title}
            width={1600}
            height={1000}
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="w-full h-full max-h-[64vh] object-contain"
            priority
          />
        </div>

        {(photo.description || (photo.tags && photo.tags.length > 0)) && (
          <div className="p-4 sm:p-5 bg-black/50 border-t border-white/5">
            {photo.description && (
              <p className="text-sm text-gray-300 leading-relaxed">{photo.description}</p>
            )}
            {photo.tags && photo.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {photo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-xs text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}