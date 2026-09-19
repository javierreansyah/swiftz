"use client";

import React from "react";
import { Movie } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface MovieRecommendationsSectionProps {
  movies: Movie[];
  onOpenRecommendationsModal: () => void;
}

export function MovieRecommendationsSection({
  movies,
  onOpenRecommendationsModal,
}: MovieRecommendationsSectionProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <ContentCarousel
      id="section-recommendations"
      title="Recommendations"
      action={{
        label: `See all ${movies.length}`,
        onClick: onOpenRecommendationsModal,
      }}
    >
      {movies.map((movie) => {
        const year = movie.release_date
          ? movie.release_date.substring(0, 4)
          : undefined;

        return (
          <MediaCard
            key={movie.id}
            type="movie"
            id={movie.id}
            title={movie.title}
            image={movie.poster_path}
            rating={movie.vote_average}
            year={year}
            href={`/movie/${movie.id}`}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}

export default MovieRecommendationsSection;
