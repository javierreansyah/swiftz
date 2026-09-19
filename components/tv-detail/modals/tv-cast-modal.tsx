"use client";

import React from "react";
import { TVShowDetailsData, Cast, Crew } from "@/types";
import { CastModal } from "@/components/movie-detail/modals/cast-modal";

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

export default TVCastModal;
