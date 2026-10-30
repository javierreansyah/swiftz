"use client";
import { useState, useEffect } from "react";
import type { HeroMovie } from "@/features/home/hero-payload";
import { SaveFeedback } from "@/features/media/components/save-feedback";
import { VideosModal } from "@/features/media/components/videos-modal";
import { QueryFeedback } from "@/features/media/components/query-feedback";
import { prioritizePlayableVideos } from "@/features/media/videos";
import { useMovieVideosQuery } from "@/features/movies/hooks/queries";
import type { Video } from "@/lib/tmdb/types/common";
import { useAuth } from "@/features/auth/auth-provider";
import {
  useMediaAccountStatesQuery,
  useWatchlistMutation,
} from "@/features/auth/hooks/queries";
import { FeaturedHeroBackdrop } from "@/features/home/components/hero/featured-hero-backdrop";
import { FeaturedHeroSpotlight } from "@/features/home/components/hero/featured-hero-spotlight";
import { FeaturedHeroUpNext } from "@/features/home/components/hero/featured-hero-up-next";
export interface FeaturedHeroProps {
  movies: HeroMovie[];
}

const EMPTY_VIDEOS: Video[] = [];

export function FeaturedHero({ movies }: FeaturedHeroProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loadedIndices, setLoadedIndices] = useState([0]);
  useEffect(() => {
    setLoadedIndices((previous) =>
      previous.includes(selectedIndex)
        ? previous
        : [...previous, selectedIndex],
    );
  }, [selectedIndex]);
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
  const videoQuery = useMovieVideosQuery(
    trailerModal.mediaId,
    trailerModal.isOpen,
  );
  const videos = videoQuery.data?.results ?? EMPTY_VIDEOS;
  const preferredVideo = prioritizePlayableVideos(videos)[0];
  const initialVideoIndex = preferredVideo
    ? videos.findIndex((video) => video.id === preferredVideo.id)
    : undefined;

  const activeMovie = movies[selectedIndex] || movies[0];

  // Watchlist status for active movie
  const { data: accountStates } = useMediaAccountStatesQuery(
    "movie",
    activeMovie?.id,
    isAuthenticated && sessionId ? sessionId : null,
  );
  const toggleWatchlistMutation = useWatchlistMutation("movie");
  const isWatchlist = accountStates?.watchlist || false;

  const handleToggleWatchlist = () => {
    if (!isAuthenticated || !sessionId || !user || !activeMovie) return;
    toggleWatchlistMutation.mutate({
      accountId: user.id,
      sessionId,
      mediaId: activeMovie.id,
      watchlist: !isWatchlist,
    });
  };

  const heroCount = Math.min(movies.length, 8);

  const handlePrev = () => {
    if (heroCount <= 1) return;
    setSelectedIndex((prev) => (prev - 1 + heroCount) % heroCount);
  };

  const handleNext = () => {
    if (heroCount <= 1) return;
    setSelectedIndex((prev) => (prev + 1) % heroCount);
  };

  // Up next list (next 3 movies)
  const upNextMovies =
    heroCount > 1
      ? [
          movies[(selectedIndex + 1) % heroCount],
          movies[(selectedIndex + 2) % heroCount],
          movies[(selectedIndex + 3) % heroCount],
        ].filter(Boolean)
      : [];

  // Auto-advance every 9 seconds if trailer modal is closed (resets on index change)
  useEffect(() => {
    if (heroCount <= 1 || trailerModal.isOpen) return;
    const interval = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % heroCount);
    }, 9000);
    return () => clearInterval(interval);
  }, [heroCount, trailerModal.isOpen, selectedIndex]);

  if (!activeMovie) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden text-media-foreground sm:overflow-visible">
      {/* 1. Full-Bleed Blurred Crossfade Backdrop */}
      <FeaturedHeroBackdrop
        movies={movies}
        selectedIndex={selectedIndex}
        loadedIndices={loadedIndices}
      />

      {/* 2. Main Foreground Banner Grid */}
      <div className="relative z-10 container pt-20 pb-4 lg:pt-24 lg:pb-6">
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-24 lg:gap-6">
          <FeaturedHeroSpotlight
            movies={movies}
            selectedIndex={selectedIndex}
            loadedIndices={loadedIndices}
            activeMovie={activeMovie}
            isAuthenticated={isAuthenticated}
            isWatchlist={isWatchlist}
            isWatchlistPending={toggleWatchlistMutation.isPending}
            onWatchTrailer={(id, title) =>
              setTrailerModal({ isOpen: true, mediaId: id, title })
            }
            onToggleWatchlist={handleToggleWatchlist}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          <FeaturedHeroUpNext
            upNextMovies={upNextMovies}
            onSelectMovie={(offset) =>
              setSelectedIndex((selectedIndex + offset) % heroCount)
            }
          />
        </div>
      </div>

      <div className="relative container">
        <SaveFeedback isError={toggleWatchlistMutation.isError} />
      </div>

      <VideosModal
        isOpen={trailerModal.isOpen}
        onClose={() =>
          setTrailerModal((current) => ({ ...current, isOpen: false }))
        }
        title={trailerModal.title}
        videos={videos}
        initialVideoIndex={initialVideoIndex}
        loadError={
          videoQuery.isLoading && trailerModal.isOpen ? (
            <p className="p-4 text-sm text-muted-foreground">
              Loading videos...
            </p>
          ) : videoQuery.isError ? (
            <QueryFeedback
              hasData={Boolean(videoQuery.data)}
              onRetry={() => void videoQuery.refetch()}
            />
          ) : undefined
        }
      />
    </section>
  );
}
