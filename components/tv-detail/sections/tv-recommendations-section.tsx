"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TVShow } from "@/types";

export interface TVRecommendationsSectionProps {
  shows: TVShow[];
}

export function TVRecommendationsSection({
  shows,
}: TVRecommendationsSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!shows || shows.length === 0) return null;

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section id="section-recommendations" className="scroll-mt-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
          More Like This
        </h2>

        {/* Carousel Arrows */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="size-8 rounded-none"
            aria-label="Scroll recommendations left"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="size-8 rounded-none"
            aria-label="Scroll recommendations right"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-3.5 overflow-x-auto scroll-smooth pb-2"
      >
        {shows.map((show) => {
          const posterUrl = show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : null;
          const year = show.first_air_date
            ? show.first_air_date.substring(0, 4)
            : "";

          return (
            <Link
              key={show.id}
              href={`/tv/${show.id}`}
              className="group w-36 shrink-0 overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg sm:w-44"
            >
              <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={show.name}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Tv className="size-10" />
                  </div>
                )}
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-none bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-primary">
                  <Star className="size-2.5 fill-current" />
                  <span>{show.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="truncate text-sm font-bold text-foreground group-hover:text-primary">
                  {show.name}
                </h4>
                <p className="truncate text-xs text-muted-foreground">
                  {year || "Series"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default TVRecommendationsSection;
