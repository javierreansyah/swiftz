"use client";
import type { ReactNode } from "react";
import type { TVShowDetailsData } from "@/lib/tmdb/types/tv";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { CastModal } from "@/features/media/components/cast-modal";
export interface TVCastModalProps {
  loadError?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  show: TVShowDetailsData;
  cast: Cast[];
  crew: Crew[];
}

export function TVCastModal({
  loadError,
  isOpen,
  onClose,
  show,
  cast,
  crew,
}: TVCastModalProps) {
  return (
    <CastModal
      loadError={loadError}
      isOpen={isOpen}
      onClose={onClose}
      movie={show}
      cast={cast}
      crew={crew}
    />
  );
}
