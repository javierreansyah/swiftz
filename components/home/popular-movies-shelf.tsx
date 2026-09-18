"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Star, Plus, Check } from "lucide-react";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { TrailerModal } from "@/components/common/trailer-modal";
import { useAuth } from "@/components/providers/auth-provider";
import { useToggleWatchlistMutation } from "@/hooks/use-tmdb";

export interface PopularMoviesShelfProps {
  movies: Movie[];
}

export function PopularMoviesShelf({ movies }: PopularMoviesShelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
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
  const toggleWatchlist = useToggleWatchlistMutation();

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = direction === "left" ? -400 : 400;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const handleWatchlist = (movie: Movie) => {
    if (!isAuthenticated || !sessionId || !user) return;
    toggleWatchlist.mutate({
      accountId: user.id,
      sessionId,
      movieId: movie.id,
      watchlist: true,
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="container space-y-4">
      <div className="flex items-center justify-between border-l-4 border-primary pl-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Popular Movies
          </h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Top trending and fan-favorite movies on Swiftz this week
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="size-8 rounded-none border-border"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="size-8 rounded-none border-border"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {movies.map((movie) => {
          const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
            : null;

          return (
            <div
              key={movie.id}
              className="group flex w-44 shrink-0 flex-col overflow-hidden rounded-none border border-border bg-card shadow-xs transition-all duration-300 hover:border-primary/50 hover:shadow-lg sm:w-48"
            >
              {/* Poster Thumbnail */}
              <div className="relative aspect-2/3 w-full bg-muted">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="192px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}

                {/* Rating badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1 rounded-none bg-black/80 px-2 py-0.5 text-xs font-bold text-primary backdrop-blur-xs">
                  <Star className="size-3 fill-current" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>

                {/* Hover Play button */}
                <button
                  type="button"
                  onClick={() =>
                    setTrailerModal({
                      isOpen: true,
                      mediaId: movie.id,
                      title: movie.title,
                    })
                  }
                  aria-label={`Play trailer for ${movie.title}`}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-110">
                    <Play className="ml-0.5 size-6 fill-current" />
                  </div>
                </button>
              </div>

              {/* Card Meta & Actions */}
              <div className="flex flex-1 flex-col justify-between space-y-2 p-3">
                <Link
                  href={`/movie/${movie.id}`}
                  className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
                >
                  {movie.title}
                </Link>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {movie.release_date
                      ? movie.release_date.substring(0, 4)
                      : "N/A"}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setTrailerModal({
                        isOpen: true,
                        mediaId: movie.id,
                        title: movie.title,
                      })
                    }
                    className="flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <Play className="size-3 fill-current" />
                    <span>Trailer</span>
                  </button>
                </div>

                {isAuthenticated && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWatchlist(movie)}
                    className="w-full gap-1 rounded-none border-border/80 text-xs"
                  >
                    <Plus className="size-3" />
                    <span>Watchlist</span>
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trailer Modal */}
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

export default PopularMoviesShelf;
