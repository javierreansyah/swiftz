"use client";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/features/media/components/media-card";
export interface MediaRecommendationsSectionProps {
  items: (Movie | TVShow)[];
  type: "movie" | "tv";
  title?: string;
  onOpenRecommendationsModal?: () => void;
}

export function MediaRecommendationsSection({
  items,
  type,
  title = type === "movie" ? "Recommendations" : "More Like This",
  onOpenRecommendationsModal,
}: MediaRecommendationsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <ContentCarousel
      id="section-recommendations"
      title={title}
      action={
        onOpenRecommendationsModal
          ? {
              label: `See all ${items.length}`,
              onClick: onOpenRecommendationsModal,
            }
          : undefined
      }
    >
      {items.map((item) => {
        const isMovie = type === "movie";
        const titleText = isMovie
          ? (item as Movie).title
          : (item as TVShow).name;
        const date = isMovie
          ? (item as Movie).release_date
          : (item as TVShow).first_air_date;
        const year = date ? date.substring(0, 4) : undefined;
        const href = isMovie ? `/movie/${item.id}` : `/tv/${item.id}`;

        return (
          <MediaCard
            key={item.id}
            type={type}
            id={item.id}
            title={titleText}
            image={item.poster_path}
            rating={item.vote_average}
            year={year}
            href={href}
            variant="shelf"
          />
        );
      })}
    </ContentCarousel>
  );
}
