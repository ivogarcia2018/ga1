"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { Photo } from "@/types/database";

interface PhotoCardProps {
  photo: Photo;
  onOpenModal?: (photo: Photo) => void;
}

export default function PhotoCard({ photo, onOpenModal }: PhotoCardProps) {
  const [failed, setFailed] = useState(false);

  return (
    <article
      onClick={() => onOpenModal?.(photo)}
      className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-zoom-in"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <ImageOff size={22} strokeWidth={1.6} />
            <span className="text-xs">Imagem indisponivel</span>
          </div>
        ) : (
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            loading="lazy"
            onError={() => setFailed(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-sm text-[11px] font-medium text-white capitalize">
          {photo.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 leading-tight truncate group-hover:text-pink-600 transition-colors">
          {photo.title}
        </h3>
        {photo.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{photo.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <time dateTime={photo.created_at}>
            {new Date(photo.created_at).toLocaleDateString("pt-PT", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
          {photo.tags && photo.tags.length > 0 && (
            <span className="truncate max-w-[55%] text-right">
              {photo.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}
              {photo.tags.length > 2 ? ` +${photo.tags.length - 2}` : ""}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}