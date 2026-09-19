"use client";

import React from "react";
import { MovieImagesData } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

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

  return (
    <ContentCarousel
      id="section-photos"
      title="Photo Gallery"
      action={{
        label: `See all ${backdrops.length}`,
        onClick: () => onOpenPhotosModal(),
      }}
    >
      {backdrops.map((photo, i) => (
        <MediaCard
          key={photo.file_path + i}
          type="photo"
          title={`${movieTitle} Photo ${i + 1}`}
          subtitle={`${photo.width} × ${photo.height}`}
          image={photo.file_path}
          onClick={() => onOpenPhotosModal(i)}
          variant="shelf"
        />
      ))}
    </ContentCarousel>
  );
}

export default MoviePhotosSection;
