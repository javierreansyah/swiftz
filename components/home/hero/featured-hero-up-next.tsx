"use client";

import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Movie } from "@/types";

export interface FeaturedHeroUpNextProps {
  upNextMovies: Movie[];
  onSelectMovie: (offset: number) => void;
}

export function FeaturedHeroUpNext({
  upNextMovies,
  onSelectMovie,
}: FeaturedHeroUpNextProps) {
  if (upNextMovies.length === 0) return null;

  return (
    <div className="hidden flex-col py-1 lg:col-span-4 lg:flex lg:h-158 xl:h-176">
      <div>
        {/* Sans-serif Up Next Title */}
        <div className="mb-3 shrink-0">
          <h2 className="font-sans text-base font-bold tracking-wider text-primary uppercase">
            Up next
          </h2>
        </div>

        <div className="space-y-3">
          {upNextMovies.map((movie, idx) => {
            const itemPoster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
              : null;

            return (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(idx + 1)}
                className="group/item flex h-47 shrink-0 cursor-pointer items-start gap-4 overflow-hidden rounded-none p-2.5 transition-colors duration-200 hover:bg-white/10 xl:h-53"
              >
                {/* 2x Enlarged Thumbnail with play overlay */}
                <div className="relative aspect-2/3 h-full shrink-0 overflow-hidden rounded-none border border-white/15 bg-neutral-900/80 shadow-lg">
                  {itemPoster && (
                    <Image
                      src={itemPoster}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 1280px) 112px, 128px"
                      className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
                    <Play className="size-7 fill-white text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Top-aligned Info Column */}
                <div className="flex min-w-0 flex-1 flex-col justify-start space-y-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5 text-xs text-primary">
                    <Play className="size-3 fill-current" />
                    <span className="font-semibold">Watch Trailer</span>
                  </div>
                  <h3 className="line-clamp-2 text-base font-bold text-white transition-colors group-hover/item:text-primary">
                    {movie.title}
                  </h3>
                  <p className="line-clamp-3 text-xs text-neutral-300/80">
                    {movie.overview || "Watch the latest trailer & info"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FeaturedHeroUpNext;
