"use client";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/features/media/components/media-card";
export type MediaItem = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_year?: string;
  media_type: "movie" | "tv";
};

export interface HomeMediaCarouselProps {
  title: string;
  items: MediaItem[];
  tabs?: {
    id: string;
    label: string;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  viewAllHref?: string;
}

export function HomeMediaCarousel({
  title,
  items,
  tabs,
  activeTab,
  onTabChange,
  viewAllHref,
}: HomeMediaCarouselProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="container">
      <ContentCarousel
        title={title}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        action={
          viewAllHref ? { label: "View all", href: viewAllHref } : undefined
        }
      >
        {items.map((item, idx) => {
          const detailHref =
            item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

          return (
            <MediaCard
              key={`${item.media_type}-${item.id}-${idx}`}
              type={item.media_type}
              id={item.id}
              title={item.title}
              image={item.poster_path}
              rating={item.vote_average}
              year={item.release_year}
              href={detailHref}
              variant="shelf"
            />
          );
        })}
      </ContentCarousel>
    </div>
  );
}
