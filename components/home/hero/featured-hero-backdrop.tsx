"use client";

import React from "react";
import Image from "next/image";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";

export interface FeaturedHeroBackdropProps {
  movies: Movie[];
  selectedIndex: number;
  offsetY: number;
}

export function FeaturedHeroBackdrop({
  movies,
  selectedIndex,
  offsetY,
}: FeaturedHeroBackdropProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-312.5 overflow-hidden select-none"
    >
      {/* Parallax Image Wrapper with generous bleed for continuous motion */}
      <div
        className="absolute -inset-x-12 -top-40 h-362.5 will-change-transform"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
        }}
      >
        {movies.slice(0, 8).map((movie, index) => {
          const isSelected = index === selectedIndex;
          const bgUrl = movie.backdrop_path
            ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
            : `https://image.tmdb.org/t/p/w780${movie.poster_path}`;

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
                className="scale-105 object-cover object-top opacity-70 blur-2xl brightness-80 contrast-105 filter transition-all duration-300 sm:blur-3xl dark:opacity-60 dark:brightness-75 dark:contrast-110"
              />
            </div>
          );
        })}

        {/* Mode-specific lighting/darkening */}
        <div className="absolute inset-0 bg-black/25 transition-colors duration-300 dark:bg-black/40" />
      </div>

      {/* Top subtle fade for navbar readability */}
      <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/90 via-background/40 to-transparent" />

      {/* Bottom smooth bleed into next section */}
      <div className="absolute inset-x-0 bottom-0 h-140 bg-linear-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}

export default FeaturedHeroBackdrop;
