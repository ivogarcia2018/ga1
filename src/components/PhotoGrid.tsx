"use client";

import { useState } from "react";
import { Photo } from "@/types/database";
import PhotoCard from "./PhotoCard";
import PhotoModal from "./PhotoModal";

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} onOpenModal={setSelectedPhoto} />
          ))}
        </div>

        {photos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl mb-4">
              📷
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma fotografia ainda</h3>
            <p className="mt-2 text-gray-500 max-w-xs">
              Seja o primeiro a adicionar uma fotografia à galeria.
            </p>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}