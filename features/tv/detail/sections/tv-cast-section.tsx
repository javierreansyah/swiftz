"use client";
import type { Cast } from "@/lib/tmdb/types/common";
import { MediaCastSection } from "@/features/media/components/media-cast-section";
export interface TVCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
}

export function TVCastSection({ cast, onOpenCastModal }: TVCastSectionProps) {
  return (
    <MediaCastSection
      cast={cast}
      onOpenCastModal={onOpenCastModal}
      title="Series Cast"
    />
  );
}
