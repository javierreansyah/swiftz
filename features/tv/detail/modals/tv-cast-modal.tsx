"use client";
import type { ReactNode } from "react";
import type { TVDetailView } from "@/features/tv/detail/payload";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { CastModal } from "@/features/media/components/cast-modal";
export interface TVCastModalProps {
  loadError?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  show: TVDetailView;
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
