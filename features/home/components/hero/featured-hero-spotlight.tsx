"use client";
import Image from "@/components/ui/image";
import Link from "next/link";
import { Play, Star, Plus, Check } from "lucide-react";
import type { Movie } from "@/lib/tmdb/types/movie";
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
    <div className="relative h-136 w-full overflow-hidden rounded-2xl border border-media-foreground/10 bg-media/90 shadow-2xl backdrop-blur-xs sm:aspect-video sm:h-auto lg:col-span-8 lg:aspect-auto lg:h-158 xl:h-176">
      {/* Crossfading Crisp Backdrop Images */}
      {movies.slice(0, 8).map((movie, index) => {
        const isSelected = index === selectedIndex;
        if (!isSelected && !loadedIndices.includes(index)) return null;
        const imgUrl = movie.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
          : movie.poster_path
            ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
            : "/assets/images/movie-placeholder.svg";

        return (
          <div
            key={movie.id}
            className={cn(
              "absolute inset-x-0 top-0 h-3/5 overflow-hidden transition-opacity duration-1000 ease-in-out sm:inset-0 sm:h-full",
              isSelected
                ? "z-1 opacity-100"
                : "pointer-events-none z-0 opacity-0",
            )}
          >
            <Image
              src={imgUrl}
              alt={movie.title}
              fill
              priority={index === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              variant="spotlight"
              className="object-cover object-center"
            />
            {/* Mobile bottom fade clipping the backdrop in the middle of the card */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-media via-media/60 to-transparent sm:hidden" />
          </div>
        );
      })}

      {/* Desktop Gradient Overlays inside Spotlight */}
      <div className="pointer-events-none absolute inset-0 z-2 hidden bg-linear-to-t from-scrim via-scrim/40 to-transparent sm:block" />
      <div className="pointer-events-none absolute inset-0 z-2 hidden bg-linear-to-r from-scrim/70 via-transparent to-black/30 sm:block" />

      {/* Mobile Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-media via-media/40 to-transparent sm:hidden" />

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
        const interactive = isSelected
          ? "pointer-events-auto"
          : "pointer-events-none";
        const linkTabIndex = isSelected ? 0 : -1;

        return (
          <div
            key={movie.id}
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 transition-opacity duration-1000 ease-in-out sm:p-6 lg:p-8",
              isSelected ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-5 lg:gap-6">
              {/* Poster group - slightly bigger on mobile and on top of main text */}
              <Link
                href={`/movie/${movie.id}`}
                prefetch={false}
                tabIndex={linkTabIndex}
                aria-label={`View details for ${movie.title}`}
                className={cn(
                  "group/poster relative block aspect-2/3 w-28 shrink-0 overflow-hidden rounded-xl border border-media-foreground/25 shadow-2xl transition-all duration-300 hover:scale-102 hover:border-primary sm:w-36 lg:w-48",
                  interactive,
                )}
              >
                <Image
                  src={pUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 192px"
                  variant="card"
                />
              </Link>

              <div className="w-full min-w-0 flex-1 space-y-1.5 sm:space-y-2">
                {/* Text group */}
                <Link
                  href={`/movie/${movie.id}`}
                  prefetch={false}
                  tabIndex={linkTabIndex}
                  className={cn(
                    "group/text block min-w-0 space-y-1 transition-colors sm:space-y-2",
                    interactive,
                  )}
                >
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-primary sm:gap-2">
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
                    <span className="text-xs tracking-wider text-primary uppercase">
                      Featured Today
                    </span>
                  </div>

                  <Heading className="line-clamp-2 heading-card text-media-foreground drop-shadow-md transition-colors group-hover/text:text-primary sm:heading-page">
                    {movie.title}
                  </Heading>

                  <p className="line-clamp-2 max-w-2xl text-xs text-media-foreground/80 sm:text-sm">
                    {movie.overview}
                  </p>
                </Link>

                {/* Actions Row */}
                <div className="pointer-events-none flex w-fit flex-wrap items-center gap-2 pt-1 sm:gap-3 sm:pt-2">
                  <Button
                    size="sm"
                    onClick={() => onWatchTrailer(movie.id, movie.title)}
                    className={cn(interactive)}
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
                      className={cn(interactive)}
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
