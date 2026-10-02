"use client";
import type { Cast } from "@/lib/tmdb/types/common";
import { MediaCastSection } from "@/features/media/components/media-cast-section";
export interface MovieCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
}

export function MovieCastSection({
  cast,
  onOpenCastModal,
}: MovieCastSectionProps) {
  return (
    <MediaCastSection
      cast={cast}
      onOpenCastModal={onOpenCastModal}
      title="Top Cast"
    />
  );
}
