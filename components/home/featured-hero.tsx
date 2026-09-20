"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, Plus, Check } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { TrailerModal } from "@/components/common/trailer-modal";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useMovieAccountStatesQuery,
  useToggleWatchlistMutation,
} from "@/hooks/use-tmdb";
import { cn } from "@/lib/utils";

export interface FeaturedHeroProps {
  movies: Movie[];
}

export function FeaturedHero({ movies }: FeaturedHeroProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const tickingRef = useRef(false);
  const [trailerModal, setTrailerModal] = useState<{
    isOpen: boolean;
    mediaId: number;
    title: string;
  }>({
    isOpen: false,
    mediaId: 0,
    title: "",
  });

  const { isAuthenticated, sessionId, user } = useAuth();

  const activeMovie = movies[selectedIndex] || movies[0];

  // Parallax scroll matching Movie detail page
  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          setOffsetY(window.scrollY * 0.38);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Watchlist status for active movie
  const { data: accountStates } = useMovieAccountStatesQuery(
    activeMovie?.id,
    isAuthenticated && sessionId ? sessionId : null
  );
  const toggleWatchlistMutation = useToggleWatchlistMutation();
  const isWatchlist = accountStates?.watchlist || false;

  const handleToggleWatchlist = () => {
    if (!isAuthenticated || !sessionId || !user || !activeMovie) return;
    toggleWatchlistMutation.mutate({
      accountId: user.id,
      sessionId,
      movieId: activeMovie.id,
      watchlist: !isWatchlist,
    });
  };

  // Up next list (next 3 movies)
  const upNextMovies =
    movies.length > 1
      ? [
          movies[(selectedIndex + 1) % movies.length],
          movies[(selectedIndex + 2) % movies.length],
          movies[(selectedIndex + 3) % movies.length],
        ].filter(Boolean)
      : [];

  // Auto-advance every 9 seconds if trailer modal is closed
  useEffect(() => {
    if (movies.length <= 1 || trailerModal.isOpen) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % Math.min(movies.length, 8));
    }, 9000);
    return () => clearInterval(interval);
  }, [movies.length, trailerModal.isOpen]);

  if (!activeMovie) {
    return null;
  }


  return (
    <section className="relative w-full text-white">
      {/* 1. Full-Bleed Blurred Crossfade Backdrop (Starting at top-0 behind header, identical to Movie Detail) */}
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

          {/* Mode-specific lighting/darkening: darkened on light mode, gently shaded on dark mode */}
          <div className="absolute inset-0 bg-black/25 transition-colors duration-300 dark:bg-black/40" />
        </div>

        {/* Top subtle fade for navbar readability */}
        <div className="absolute inset-x-0 top-0 h-36 bg-linear-to-b from-background/90 via-background/40 to-transparent" />

        {/* Bottom smooth bleed: continuous gradient transition from transparent (opacity 0) to opacity 100 (background) into next section */}
        <div className="absolute inset-x-0 bottom-0 h-140 bg-linear-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* 2. Main Foreground Banner Grid (Padded down from top navbar) */}
      <div className="relative z-10 container pt-20 pb-4 lg:pt-24 lg:pb-6">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Spotlight Hero Player (Left 8 Cols on desktop, 12 on mobile) */}
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-none border border-white/10 bg-neutral-950/80 shadow-2xl backdrop-blur-xs sm:aspect-video lg:col-span-8 lg:aspect-auto lg:h-158 xl:h-176">
            {/* Crossfading Crisp Backdrop Images */}
            {movies.slice(0, 8).map((movie, index) => {
              const isSelected = index === selectedIndex;
              const imgUrl = movie.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                : `https://image.tmdb.org/t/p/w780${movie.poster_path}`;

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
                    className="object-cover brightness-75 transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              );
            })}

            {/* Gradient Overlays inside Spotlight */}
            <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-t from-black via-black/40 to-transparent" />
            <div className="pointer-events-none absolute inset-0 z-2 bg-linear-to-r from-black/70 via-transparent to-black/30" />

            {/* Banner Full-Coverage Clickable Link to Active Movie Detail */}
            <Link
              href={`/movie/${activeMovie.id}`}
              className="absolute inset-0 z-3 block cursor-pointer"
              aria-label={`View details for ${activeMovie.title}`}
            />

            {/* Bottom Content Bars for all hero movies with smooth 1000ms crossfade to eliminate shifts */}
            {movies.slice(0, 8).map((movie, index) => {
              const isSelected = index === selectedIndex;
              const pUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/assets/images/movie-placeholder.png";

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
                      aria-label={`View details for ${movie.title}`}
                      className="group/poster relative hidden aspect-2/3 w-36 shrink-0 overflow-hidden rounded-none border border-white/25 shadow-2xl transition-all duration-300 hover:scale-102 hover:border-primary sm:block lg:w-48"
                    >
                      <Image
                        src={pUrl}
                        alt={movie.title}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 1024px) 144px, 192px"
                        className="object-cover transition-transform duration-500 group-hover/poster:scale-105"
                      />
                    </Link>

                    {/* Title & Metadata */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
                        <span className="flex items-center gap-1 rounded-none bg-primary/20 px-2 py-0.5 text-primary">
                          <Star className="size-3 fill-current" />
                          {movie.vote_average.toFixed(1)}
                        </span>
                        {movie.release_date && (
                          <span className="text-white/80">
                            {movie.release_date.substring(0, 4)}
                          </span>
                        )}
                        <span className="text-white/60">&bull;</span>
                        <span className="tracking-wider text-primary uppercase">
                          Featured Today
                        </span>
                      </div>

                      <Link
                        href={`/movie/${movie.id}`}
                        className="group/title block transition-colors"
                      >
                        <h1 className="line-clamp-2 text-2xl font-black text-white drop-shadow-md transition-colors group-hover/title:text-primary sm:text-3xl lg:text-4xl">
                          {movie.title}
                        </h1>
                      </Link>

                      <p className="line-clamp-2 max-w-2xl text-xs text-white/80 sm:text-sm">
                        {movie.overview}
                      </p>

                      {/* Actions Row */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            setTrailerModal({
                              isOpen: true,
                              mediaId: movie.id,
                              title: movie.title,
                            })
                          }
                          className="gap-2 rounded-none bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                        >
                          <Play className="size-4 fill-current" />
                          <span>Watch Trailer</span>
                        </Button>

                        {isAuthenticated && isSelected && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleToggleWatchlist}
                            disabled={toggleWatchlistMutation.isPending}
                            className="gap-1.5 rounded-none text-white/90 hover:bg-white/10 hover:text-white"
                          >
                            {isWatchlist ? (
                              <>
                                <Check className="size-4 text-emerald-400" />
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

          {/* Up Next List (Right 4 Cols on desktop, hidden on mobile) */}
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
                      onClick={() =>
                        setSelectedIndex(
                          (selectedIndex + idx + 1) % movies.length
                        )
                      }
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
        </div>
      </div>

      {/* Shared Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() =>
          setTrailerModal({ isOpen: false, mediaId: 0, title: "" })
        }
        title={trailerModal.title}
        mediaId={trailerModal.mediaId}
        mediaType="movie"
      />
    </section>
  );
}

export default FeaturedHero;
