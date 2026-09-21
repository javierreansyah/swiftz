"use client";

import React from "react";
import { Cast } from "@/types";
import { MediaCastSection } from "@/components/common/media-cast-section";

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

export default TVCastSection;
