"use client";

import React from "react";
import Image from "@/components/ui/image";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";

export interface FeaturedHeroBackdropProps {
  movies: Movie[];
  selectedIndex: number;
  loadedIndices: number[];
  offsetY: number;
}

export function FeaturedHeroBackdrop({
  movies,
  selectedIndex,
  loadedIndices,
  offsetY,
}: FeaturedHeroBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-312.5 overflow-hidden select-none"
    >
      {/* Parallax Image Wrapper with generous bleed for continuous motion */}
      <div
        className="absolute -inset-x-12 -top-40 h-362.5 parallax-backdrop will-change-transform"
        style={{
          "--parallax-offset": `${offsetY}px`,
        } as React.CSSProperties}
      >
        {movies.slice(0, 8).map((movie, index) => {
          const isSelected = index === selectedIndex;
          if (!isSelected && !loadedIndices.includes(index)) return null;
          const bgUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : "/assets/images/movie-placeholder.svg";

          return (
            <div
              key={movie.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isSelected ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={bgUrl}
                alt={movie.title}
                fill
                priority={index === 0}
                sizes="100vw"
                variant="ambient"
              />
            </div>
          );
        })}

        {/* Mode-specific lighting/darkening */}
        <div className="absolute inset-0 bg-scrim/25 transition-colors duration-300 dark:bg-scrim/40" />
      </div>

      {/* Top subtle fade for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/90 via-background/40 to-transparent" />

      {/* Bottom smooth bleed into next section */}
      <div className="absolute inset-x-0 bottom-0 h-140 bg-linear-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}

export default FeaturedHeroBackdrop;
