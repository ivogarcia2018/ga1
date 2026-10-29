"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Photo } from "@/types/database";
import { X, ChevronLeft, ChevronRight, Maximize, Download } from "lucide-react";

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
            <X size={20} strokeWidth={2.5} />
          </button>
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{photo.category}</span>
            <span className="w-1 h-1 rounded-full bg-pink-500" />
            <span className="text-sm font-medium">{new Date(photo.created_at).toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}</span>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Footer with info and actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-1">{photo.title}</h2>
              {photo.description && (
                <p className="text-gray-300 text-sm line-clamp-2">{photo.description}</p>
              )}
              {photo.tags && photo.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {photo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-xs text-gray-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
                title="Download"
              >
                <Download size={18} strokeWidth={1.5} />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/10"
                title="Ver em ecrã cheio"
              >
                <Maximize size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Close on Escape */}
      <div className="fixed inset-0 pointer-events-none" />
    </div>
  );
}