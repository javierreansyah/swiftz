"use client";

import React from "react";
import { TVSeason } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface TVSeasonsSectionProps {
  seasons: TVSeason[];
  onOpenSeason?: (seasonNumber: number) => void;
}

export function TVSeasonsSection({
  seasons,
  onOpenSeason,
}: TVSeasonsSectionProps) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <ContentCarousel
      id="section-seasons"
      title="Seasons"
      count={seasons.length}
      action={
        onOpenSeason
          ? {
              label: "Episode Guide",
              onClick: () => onOpenSeason(seasons[0]?.season_number ?? 1),
            }
          : undefined
      }
    >
      {seasons.map((season) => {
        const airYear = season.air_date
          ? season.air_date.substring(0, 4)
          : undefined;

        return (
          <MediaCard
            key={season.id}
            type="season"
            id={season.id}
            title={season.name}
            subtitle={`${season.episode_count} Episodes`}
            year={airYear}
            badge={`${season.episode_count} Eps`}
            image={season.poster_path}
            onClick={() => onOpenSeason?.(season.season_number)}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}

export default TVSeasonsSection;
