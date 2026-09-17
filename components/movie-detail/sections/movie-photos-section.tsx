import React from "react";
import Image from "next/image";
import { Image as ImageIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieImagesData } from "@/types";

export interface MoviePhotosSectionProps {
  movieTitle: string;
  images?: MovieImagesData;
  onOpenPhotosModal: (index?: number) => void;
}

export function MoviePhotosSection({
  movieTitle,
  images,
  onOpenPhotosModal,
}: MoviePhotosSectionProps) {
  const backdrops = images?.backdrops || [];
  if (backdrops.length === 0) return null;

  const previewPhotos = backdrops.slice(0, 6);

  return (
    <section id="section-photos" className="space-y-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="size-5 text-primary" />
          <h2 className="text-xl font-bold sm:text-2xl">Photo Gallery</h2>
          <span className="text-xs text-muted-foreground">
            ({backdrops.length})
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenPhotosModal(0)}
          className="gap-1 text-xs font-semibold text-primary hover:text-primary"
        >
          <span>View all photos</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {previewPhotos.map((photo, i) => (
          <div
            key={photo.file_path + i}
            onClick={() => onOpenPhotosModal(i)}
            className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${photo.file_path}`}
              alt={`${movieTitle} Photo`}
              fill
              sizes="(max-width: 640px) 50vw, 220px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MoviePhotosSection;
