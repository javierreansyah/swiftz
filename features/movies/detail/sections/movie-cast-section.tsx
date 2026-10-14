"use client";
import type { Cast } from "@/lib/tmdb/types/common";
import { MediaCastSection } from "@/features/media/components/media-cast-section";
export interface MovieCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
  onSelectPerson: (personId: number) => void;
}

export function MovieCastSection({
  cast,
  onOpenCastModal,
  onSelectPerson,
}: MovieCastSectionProps) {
  return (
    <MediaCastSection
      cast={cast}
      onOpenCastModal={onOpenCastModal}
      onSelectPerson={onSelectPerson}
      title="Top Cast"
    />
  );
}
