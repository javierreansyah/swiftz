"use client";

import React from "react";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";
import { SectionHeader } from "@/components/common/section-header";
import { MovieCardSkeleton } from "@/components/common/movie-card-skeleton";
import { Movie, TVShow } from "@/types";

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
            <div key={i} className="w-52 shrink-0 sm:w-60">
              <MovieCardSkeleton />
            </div>
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
      {displayItems.map((item) => {
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

export default MediaCarouselRow;
