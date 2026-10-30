"use client";
import type { Cast } from "@/lib/tmdb/types/common";
import { MediaCastSection } from "@/features/media/components/media-cast-section";
export interface TVCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
  onSelectPerson: (personId: number) => void;
}

export function TVCastSection({
  cast,
  onOpenCastModal,
  onSelectPerson,
}: TVCastSectionProps) {
  return (
    <MediaCastSection
      cast={cast}
      onOpenCastModal={onOpenCastModal}
      onSelectPerson={onSelectPerson}
      title="Series Cast"
    />
  );
}
