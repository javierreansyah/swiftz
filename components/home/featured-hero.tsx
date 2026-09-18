"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Star, ChevronRight, Info, Plus, Check } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { TrailerModal } from "@/components/common/trailer-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useMovieAccountStatesQuery, useToggleWatchlistMutation } from "@/hooks/use-tmdb";

export interface FeaturedHeroProps {
  movies: Movie[];
}

export function FeaturedHero({ movies }: FeaturedHeroProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
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
  const upNextMovies = movies.length > 1
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

  const backdropUrl = activeMovie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${activeMovie.backdrop_path}`
    : `https://image.tmdb.org/t/p/w500${activeMovie.poster_path}`;

  const posterUrl = activeMovie.poster_path
    ? `https://image.tmdb.org/t/p/w342${activeMovie.poster_path}`
    : null;

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="container py-4 lg:py-6">
        {/* Main Banner Grid: Left Large Spotlight + Right Up Next List */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
          {/* Spotlight Hero (Left 8 Cols on desktop, 12 on mobile) */}
          <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-900 sm:aspect-video lg:col-span-8">
            {/* Backdrop Image */}
            <Image
              src={backdropUrl}
              alt={activeMovie.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover brightness-75 transition-all duration-700 ease-out hover:scale-105"
            />

            {/* Gradient Overlays */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-black/70 via-transparent to-black/30" />

            {/* Center Big Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() =>
                  setTrailerModal({
                    isOpen: true,
                    mediaId: activeMovie.id,
                    title: activeMovie.title,
                  })
                }
                aria-label={`Play trailer for ${activeMovie.title}`}
                className="group/play flex size-16 items-center justify-center rounded-full border border-white/40 bg-black/60 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary hover:bg-primary sm:size-20"
              >
                <Play className="ml-1 size-8 fill-white text-white transition-colors group-hover/play:fill-primary-foreground group-hover/play:text-primary-foreground sm:size-10" />
              </button>
            </div>

            {/* Bottom Content Bar */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
              <div className="flex items-end gap-4">
                {/* Poster Thumbnail Badge (Desktop) */}
                {posterUrl && (
                  <div className="relative hidden aspect-2/3 w-20 shrink-0 overflow-hidden border border-white/20 shadow-2xl sm:block lg:w-24">
                    <Image
                      src={posterUrl}
                      alt={activeMovie.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title & Metadata */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
                    <span className="flex items-center gap-1 rounded-none bg-primary/20 px-2 py-0.5 text-primary">
                      <Star className="size-3 fill-current" />
                      {activeMovie.vote_average.toFixed(1)}
                    </span>
                    {activeMovie.release_date && (
                      <span className="text-white/80">
                        {activeMovie.release_date.substring(0, 4)}
                      </span>
                    )}
                    <span className="text-white/60">&bull;</span>
                    <span className="tracking-wider text-primary uppercase">
                      Featured Today
                    </span>
                  </div>

                  <h1 className="line-clamp-2 text-2xl font-black text-white drop-shadow-md lg:text-3xl">
                    {activeMovie.title}
                  </h1>

                  <p className="line-clamp-2 max-w-2xl text-xs text-white/80 sm:text-sm">
                    {activeMovie.overview}
                  </p>

                  {/* Actions Row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        setTrailerModal({
                          isOpen: true,
                          mediaId: activeMovie.id,
                          title: activeMovie.title,
                        })
                      }
                      className="gap-2 rounded-none bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="size-4 fill-current" />
                      <span>Watch Trailer</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="gap-2 rounded-none border-white/30 bg-black/40 text-white backdrop-blur-xs hover:border-white hover:bg-white/10"
                    >
                      <Link href={`/movie/${activeMovie.id}`}>
                        <Info className="size-4" />
                        <span>Details</span>
                      </Link>
                    </Button>

                    {isAuthenticated && (
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
          </div>

          {/* Up Next Sidebar (Right 4 Cols on desktop, hidden on mobile) */}
          <div className="hidden flex-col justify-between space-y-3 rounded-none border border-white/10 bg-neutral-950 p-4 lg:col-span-4 lg:flex">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold tracking-wider text-primary uppercase">
                  Up next
                </h2>
                <span className="text-xs text-neutral-400">
                  {selectedIndex + 1} of {Math.min(movies.length, 8)}
                </span>
              </div>

              <div className="space-y-2">
                {upNextMovies.map((movie, idx) => {
                  const itemPoster = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                    : null;

                  return (
                    <div
                      key={movie.id}
                      onClick={() =>
                        setSelectedIndex(
                          (selectedIndex + idx + 1) % movies.length
                        )
                      }
                      className="group/item flex cursor-pointer gap-3 border border-transparent p-2 transition-all duration-200 hover:border-white/20 hover:bg-white/5"
                    >
                      {/* Thumbnail with mini play overlay */}
                      <div className="relative aspect-2/3 w-16 shrink-0 overflow-hidden border border-white/10 bg-neutral-900">
                        {itemPoster && (
                          <Image
                            src={itemPoster}
                            alt={movie.title}
                            fill
                            sizes="64px"
                            className="object-cover transition-transform group-hover/item:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover/item:opacity-100">
                          <Play className="size-5 fill-white text-white" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-primary">
                          <Play className="size-3 fill-current" />
                          <span className="font-semibold">Watch Trailer</span>
                        </div>
                        <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors group-hover/item:text-primary">
                          {movie.title}
                        </h3>
                        <p className="line-clamp-2 text-xs text-neutral-400">
                          {movie.overview || "Watch the latest trailer & info"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom link to browse all movies */}
            <Link
              href="/movie"
              className="flex items-center justify-between border-t border-white/10 pt-3 text-xs font-semibold text-neutral-300 transition-colors hover:text-primary"
            >
              <span>Browse All Movies</span>
              <ChevronRight className="size-4" />
            </Link>
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
