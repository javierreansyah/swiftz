"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { Movie, TVShow } from "@/types";
import { Button } from "@/components/ui/button";
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
  subtitle?: string;
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
  subtitle,
  items,
  tabs,
  activeTab,
  onTabChange,
  viewAllHref,
}: HomeMediaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="container space-y-4">
      {/* Header with Title, Tabs, and Arrow Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-l-4 border-primary pl-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {title}
            </h2>

            {/* Optional Tabs (e.g. Movies / TV) */}
            {tabs && tabs.length > 0 && (
              <div className="flex items-center gap-1 rounded-none border border-border bg-muted/40 p-0.5">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => onTabChange?.(tab.id)}
                      className={`rounded-none px-2.5 py-1 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <Link href={viewAllHref}>View all</Link>
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("left")}
            aria-label="Previous items"
            className="size-8 rounded-none border-border"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("right")}
            aria-label="Next items"
            className="size-8 rounded-none border-border"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {items.map((item) => {
          const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
            : null;

          const detailHref =
            item.media_type === "tv"
              ? `/tv/${item.id}`
              : `/movie/${item.id}`;

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              className="group flex w-40 shrink-0 flex-col overflow-hidden rounded-none border border-border bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-lg sm:w-44"
            >
              {/* Poster Thumbnail */}
              <div className="relative aspect-2/3 w-full bg-muted">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={item.title}
                    fill
                    sizes="176px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Rating badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-none bg-black/80 px-2 py-0.5 text-xs font-bold text-primary backdrop-blur-xs">
                  <Star className="size-3 fill-current" />
                  <span>{item.vote_average.toFixed(1)}</span>
                </div>

                {/* Hover Play button */}
                <button
                  type="button"
                  onClick={() =>
                    setTrailerModal({
                      isOpen: true,
                      mediaId: item.id,
                      title: item.title,
                      mediaType: item.media_type,
                    })
                  }
                  aria-label={`Play trailer for ${item.title}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-110">
                    <Play className="ml-0.5 size-5 fill-current" />
                  </div>
                </button>
              </div>

              {/* Card Meta */}
              <div className="flex flex-1 flex-col justify-between space-y-1.5 p-3">
                <Link
                  href={detailHref}
                  className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
                >
                  {item.title}
                </Link>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.release_year || ""}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setTrailerModal({
                        isOpen: true,
                        mediaId: item.id,
                        title: item.title,
                        mediaType: item.media_type,
                      })
                    }
                    className="flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <Play className="size-3 fill-current" />
                    <span>Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
    </section>
  );
}

export default HomeMediaCarousel;
