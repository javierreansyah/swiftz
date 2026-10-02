"use client";
import type { TVShowDetailsData } from "@/lib/tmdb/types/tv";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { CastModal } from "@/features/media/components/cast-modal";
export interface TVCastModalProps {
  isOpen: boolean;
  onClose: () => void;
  show: TVShowDetailsData;
  cast: Cast[];
  crew: Crew[];
}

export function TVCastModal({
  isOpen,
  onClose,
  show,
  cast,
  crew,
}: TVCastModalProps) {
  return (
    <CastModal
      isOpen={isOpen}
      onClose={onClose}
      movie={show}
      cast={cast}
      crew={crew}
    />
  );
}
