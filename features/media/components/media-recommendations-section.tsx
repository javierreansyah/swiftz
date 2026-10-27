"use client";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import { ContentCarousel } from "@/components/common/content-carousel";
import { CatalogCard } from "@/features/media/components/catalog-card";
export interface MediaRecommendationsSectionProps {
  items: (Movie | TVShow)[];
  type: "movie" | "tv";
  title?: string;
  totalCount?: number;
  onOpenRecommendationsModal?: () => void;
}

export function MediaRecommendationsSection({
  items,
  type,
  title = type === "movie" ? "Recommendations" : "More Like This",
  totalCount,
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
              label:
                totalCount !== undefined && totalCount > 0
                  ? `See all ${totalCount}`
                  : "See all",
              onClick: onOpenRecommendationsModal,
            }
          : undefined
      }
    >
      {items.map((item) => (
        <CatalogCard key={item.id} item={item} type={type} />
      ))}
    </ContentCarousel>
  );
}
