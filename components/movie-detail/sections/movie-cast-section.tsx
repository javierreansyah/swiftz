"use client";

import React from "react";
import { Cast } from "@/types";
import { MediaCastSection } from "@/components/common/media-cast-section";

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

export default MovieCastSection;
