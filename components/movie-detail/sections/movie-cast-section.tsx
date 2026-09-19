"use client";

import React from "react";
import { Cast } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface MovieCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
}

export function MovieCastSection({
  cast,
  onOpenCastModal,
}: MovieCastSectionProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <ContentCarousel
      id="section-cast"
      title="Top Cast"
      action={{
        label: `See all ${cast.length}`,
        onClick: onOpenCastModal,
      }}
    >
      {cast.map((c) => (
        <MediaCard
          key={c.id + (c.character || "")}
          type="person"
          id={c.id}
          title={c.name}
          subtitle={c.character || "Actor"}
          image={c.profile_path}
          onClick={onOpenCastModal}
          variant="shelf"
        />
      ))}
    </ContentCarousel>
  );
}

export default MovieCastSection;
