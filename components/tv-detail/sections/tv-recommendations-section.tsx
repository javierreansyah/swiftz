"use client";

import React from "react";
import { TVShow } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface TVRecommendationsSectionProps {
  shows: TVShow[];
  onOpenRecommendationsModal?: () => void;
}

export function TVRecommendationsSection({
  shows,
  onOpenRecommendationsModal,
}: TVRecommendationsSectionProps) {
  if (!shows || shows.length === 0) return null;

  return (
    <ContentCarousel
      id="section-recommendations"
      title="More Like This"
      action={
        onOpenRecommendationsModal
          ? {
              label: `See all ${shows.length}`,
              onClick: onOpenRecommendationsModal,
            }
          : undefined
      }
    >
      {shows.map((show) => {
        const year = show.first_air_date
          ? show.first_air_date.substring(0, 4)
          : undefined;

        return (
          <MediaCard
            key={show.id}
            type="tv"
            id={show.id}
            title={show.name}
            image={show.poster_path}
            rating={show.vote_average}
            year={year}
            href={`/tv/${show.id}`}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}

export default TVRecommendationsSection;
