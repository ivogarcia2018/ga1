"use client";

import Image from "next/image";
import { Photo } from "@/types/database";

interface PhotoCardProps {
  photo: Photo;
  onOpenModal?: (photo: Photo) => void;
}

export default function PhotoCard({ photo, onOpenModal }: PhotoCardProps) {
  return (
    <article
      className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
      onClick={() => onOpenModal?.(photo)}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <Image
          src={photo.image_url}
          alt={photo.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <div className="flex items-end gap-2">
            <span className="text-white font-semibold text-sm">{photo.title}</span>
            <span className="text-white/80 text-xs font-medium px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm">
              {photo.category}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 leading-tight group-hover:text-pink-600 transition-colors">
          {photo.title}
        </h3>
        {photo.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{photo.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(photo.created_at).toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {photo.tags && photo.tags.length > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.5 0 0 .5.5.5v5c0 .5.5.5.5.5h7v-3.517a2 2 0 00-.5-.5c-.3-.3-.5-.5-.5-.5" />
              </svg>
              {photo.tags.length}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}