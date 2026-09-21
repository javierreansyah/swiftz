"use client";

import React, { useState, useEffect, useRef } from "react";
import { Movie } from "@/types";
import { TrailerModal } from "@/components/common/trailer-modal";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useMovieAccountStatesQuery,
  useToggleWatchlistMutation,
} from "@/hooks/use-tmdb";
import { FeaturedHeroBackdrop } from "./hero/featured-hero-backdrop";
import { FeaturedHeroSpotlight } from "./hero/featured-hero-spotlight";
import { FeaturedHeroUpNext } from "./hero/featured-hero-up-next";

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
      {/* 1. Full-Bleed Blurred Crossfade Backdrop */}
      <FeaturedHeroBackdrop
        movies={movies}
        selectedIndex={selectedIndex}
        offsetY={offsetY}
      />

      {/* 2. Main Foreground Banner Grid */}
      <div className="relative z-10 container pt-20 pb-4 lg:pt-24 lg:pb-6">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-12 lg:gap-6">
          <FeaturedHeroSpotlight
            movies={movies}
            selectedIndex={selectedIndex}
            activeMovie={activeMovie}
            isAuthenticated={isAuthenticated}
            isWatchlist={isWatchlist}
            isWatchlistPending={toggleWatchlistMutation.isPending}
            onWatchTrailer={(id, title) =>
              setTrailerModal({ isOpen: true, mediaId: id, title })
            }
            onToggleWatchlist={handleToggleWatchlist}
          />

          <FeaturedHeroUpNext
            upNextMovies={upNextMovies}
            onSelectMovie={(offset) =>
              setSelectedIndex((selectedIndex + offset) % movies.length)
            }
          />
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
