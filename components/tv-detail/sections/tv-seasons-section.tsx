"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TVSeason } from "@/types";

export interface TVSeasonsSectionProps {
  seasons: TVSeason[];
}

export function TVSeasonsSection({ seasons }: TVSeasonsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!seasons || seasons.length === 0) return null;

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section id="section-seasons" className="scroll-mt-24 space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Seasons ({seasons.length})
          </h2>
        </div>

        {/* Desktop Carousel Arrows */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="size-8 rounded-none"
            aria-label="Scroll seasons left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="size-8 rounded-none"
            aria-label="Scroll seasons right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Carousel of Seasons */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {seasons.map((season) => {
          const posterUrl = season.poster_path
            ? `https://image.tmdb.org/t/p/w342${season.poster_path}`
            : null;
          const airYear = season.air_date
            ? season.air_date.substring(0, 4)
            : "";

          return (
            <div
              key={season.id}
              className="group flex w-72 shrink-0 overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg sm:w-80"
            >
              {/* Season Poster */}
              <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden bg-muted">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={season.name}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                    <Layers className="size-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Season Info */}
              <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5">
                <div className="space-y-1">
                  <h3 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary">
                    {season.name}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground">
                    {season.episode_count} Episodes {airYear ? `· ${airYear}` : ""}
                  </p>
                  {season.overview && (
                    <p className="line-clamp-3 text-xs text-muted-foreground/80">
                      {season.overview}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TVSeasonsSection;
