"use client";

import React from "react";
import Image from "@/components/ui/image";
import Link from "next/link";
import { Play, Star, Plus, Check } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FeaturedHeroSpotlightProps {
  movies: Movie[];
  selectedIndex: number;
  loadedIndices: number[];
  activeMovie: Movie;
  isAuthenticated: boolean;
  isWatchlist: boolean;
  isWatchlistPending: boolean;
  onWatchTrailer: (movieId: number, movieTitle: string) => void;
  onToggleWatchlist: () => void;
}

export function FeaturedHeroSpotlight({
  movies,
  selectedIndex,
  loadedIndices,
  activeMovie,
  isAuthenticated,
  isWatchlist,
  isWatchlistPending,
  onWatchTrailer,
  onToggleWatchlist,
}: FeaturedHeroSpotlightProps) {
  return (
    <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-media-foreground/10 bg-media/80 shadow-2xl backdrop-blur-xs sm:aspect-video lg:col-span-8 lg:aspect-auto lg:h-158 xl:h-176">
      {/* Crossfading Crisp Backdrop Images */}
      {movies.slice(0, 8).map((movie, index) => {
        const isSelected = index === selectedIndex;
        if (!isSelected && !loadedIndices.includes(index)) return null;
        const imgUrl = movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          : movie.poster_path ? `https://image.tmdb.org/t/p/w780${movie.poster_path}` : "/assets/images/movie-placeholder.svg";

        return (
          <div
            key={movie.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              isSelected ? "z-1 opacity-100" : "pointer-events-none z-0 opacity-0"
            )}
          >
            <Image
              src={imgUrl}
              alt={movie.title}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              variant="spotlight"
            />
          </div>
        );
      })}

      {/* Gradient Overlays inside Spotlight */}
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-scrim via-scrim/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-scrim/70 via-transparent to-black/30" />

      {/* Banner Full-Coverage Clickable Link to Active Movie Detail */}
      <Link
        href={`/movie/${activeMovie.id}`}
        prefetch={false}
        className="absolute inset-0 z-3 block cursor-pointer"
        aria-label={`View details for ${activeMovie.title}`}
      />

      {/* Bottom Content Bars for all hero movies with smooth 1000ms crossfade */}
      {movies.slice(0, 8).map((movie, index) => {
        const isSelected = index === selectedIndex;
        if (!isSelected && !loadedIndices.includes(index)) return null;
        const Heading = isSelected ? "h1" : "h2";
        const pUrl = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/assets/images/movie-placeholder.svg";

        return (
          <div
            key={movie.id}
            className={cn(
              "absolute inset-x-0 bottom-0 z-10 p-4 transition-opacity duration-1000 ease-in-out sm:p-6 lg:p-8",
              isSelected
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            )}
          >
            <div className="flex items-end gap-5 lg:gap-6">
              {/* 2x Enlarged Poster Thumbnail Badge */}
              <Link
                href={`/movie/${movie.id}`}
                prefetch={false}
                aria-label={`View details for ${movie.title}`}
                className="group/poster relative hidden aspect-2/3 w-36 shrink-0 overflow-hidden rounded-xl border border-media-foreground/25 shadow-2xl transition-all duration-300 hover:scale-102 hover:border-primary sm:block lg:w-48"
              >
                <Image
                  src={pUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1024px) 144px, 192px"
                  variant="card"
                />
              </Link>

              {/* Title & Metadata */}
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
                  <span className="flex items-center gap-1 rounded-xl bg-primary/20 px-2 py-0.5 text-primary">
                    <Star className="size-3 fill-current" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                  {movie.release_date && (
                    <span className="text-media-foreground/80">
                      {movie.release_date.substring(0, 4)}
                    </span>
                  )}
                  <span className="text-media-foreground/60">&bull;</span>
                  <span className="tracking-wider text-primary uppercase">
                    Featured Today
                  </span>
                </div>

                <Link
                  href={`/movie/${movie.id}`}
                  prefetch={false}
                  className="group/title block transition-colors"
                >
                  <Heading className="line-clamp-2 heading-page text-media-foreground drop-shadow-md transition-colors group-hover/title:text-primary">
                    {movie.title}
                  </Heading>
                </Link>

                <p className="line-clamp-2 max-w-2xl text-xs text-media-foreground/80 sm:text-sm">
                  {movie.overview}
                </p>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onWatchTrailer(movie.id, movie.title)}
                  >
                    <Play className="size-4 fill-current" />
                    <span>Watch Trailer</span>
                  </Button>

                  {isAuthenticated && isSelected && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onToggleWatchlist}
                      disabled={isWatchlistPending}
                    >
                      {isWatchlist ? (
                        <>
                          <Check className="size-4 text-success" />
                          <span>In Watchlist</span>
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" />
                          <span>Watchlist</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FeaturedHeroSpotlight;
