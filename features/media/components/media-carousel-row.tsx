"use client";
import { ContentCarousel } from "@/components/common/content-carousel";
import { CatalogCard } from "@/features/media/components/catalog-card";
import { SectionHeader } from "@/components/common/section-header";
import { MovieCardSkeleton } from "@/features/media/components/movie-card-skeleton";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
export interface MediaCarouselRowProps {
  title: string;
  items?: (Movie | TVShow)[];
  isLoading: boolean;
  viewAllHref: string;
  type: "movie" | "tv";
}

export function MediaCarouselRow({
  title,
  items,
  isLoading,
  viewAllHref,
  type,
}: MediaCarouselRowProps) {
  const displayItems = items || [];

  if (isLoading) {
    return (
      <section className="space-y-4">
        <SectionHeader
          title={title}
          action={{ label: "View all", href: viewAllHref }}
        />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <MovieCardSkeleton key={i} className="w-36 shrink-0 sm:w-60" />
          ))}
        </div>
      </section>
    );
  }

  if (displayItems.length === 0) return null;

  return (
    <ContentCarousel
      title={title}
      action={{ label: "View all", href: viewAllHref }}
    >
      {displayItems.map((item) => (
        <CatalogCard key={item.id} item={item} type={type} />
      ))}
    </ContentCarousel>
  );
}
