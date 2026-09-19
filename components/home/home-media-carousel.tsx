"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";
import { TrailerModal } from "@/components/common/trailer-modal";

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
  const [trailerModal, setTrailerModal] = useState<{
    isOpen: boolean;
    mediaId: number;
    title: string;
    mediaType: "movie" | "tv";
  }>({
    isOpen: false,
    mediaId: 0,
    title: "",
    mediaType: "movie",
  });

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
        {items.map((item) => {
          const detailHref =
            item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;

          return (
            <MediaCard
              key={`${item.media_type}-${item.id}`}
              type={item.media_type}
              id={item.id}
              title={item.title}
              image={item.poster_path}
              rating={item.vote_average}
              year={item.release_year}
              href={detailHref}
              variant="shelf"
              actionIcon={<Play className="size-3.5 fill-current" />}
              actionTitle="Watch Trailer"
              onActionClick={() =>
                setTrailerModal({
                  isOpen: true,
                  mediaId: item.id,
                  title: item.title,
                  mediaType: item.media_type,
                })
              }
            />
          );
        })}
      </ContentCarousel>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() =>
          setTrailerModal({
            isOpen: false,
            mediaId: 0,
            title: "",
            mediaType: "movie",
          })
        }
        title={trailerModal.title}
        mediaId={trailerModal.mediaId}
        mediaType={trailerModal.mediaType}
      />
    </div>
  );
}

export default HomeMediaCarousel;
