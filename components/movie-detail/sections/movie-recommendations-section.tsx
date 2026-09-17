"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/common/movie-card";
import { Movie } from "@/types";

export interface MovieRecommendationsSectionProps {
  movies: Movie[];
  onOpenRecommendationsModal: () => void;
}

export function MovieRecommendationsSection({
  movies,
  onOpenRecommendationsModal,
}: MovieRecommendationsSectionProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  if (!movies || movies.length === 0) {
    return null;
  }

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section id="section-recommendations" className="scroll-mt-24 space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        {/* Left: Title + Desktop See all button */}
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Recommendations
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRecommendationsModal}
            className="hidden gap-1 text-xs font-semibold text-primary hover:text-primary sm:inline-flex"
          >
            <span>See all {movies.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        {/* Right side: Mobile See all button OR Desktop Carousel arrows */}
        <div className="flex items-center gap-1.5">
          {/* Mobile See all button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenRecommendationsModal}
            className="gap-1 text-xs font-semibold text-primary hover:text-primary sm:hidden"
          >
            <span>See all {movies.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>

          {/* Desktop Carousel Arrows */}
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="size-8 rounded-full"
              aria-label="Scroll recommendations left"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="size-8 rounded-full"
              aria-label="Scroll recommendations right"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-38 shrink-0 sm:w-48">
            <MovieCard
              id={movie.id}
              title={movie.title}
              poster={movie.poster_path}
              rating={movie.vote_average}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MovieRecommendationsSection;
