"use client";
import type { DetailStaticContent } from "@/features/media/detail-static-content";
import { useState, useMemo } from "react";
import { prioritizePlayableVideos } from "@/features/media/videos";
import type { MovieDetailView } from "@/features/movies/detail/payload";
import type { Cast, Crew, Video } from "@/lib/tmdb/types/common";
import { useAuth } from "@/features/auth/auth-provider";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import { MovieHeroHeader } from "@/features/movies/detail/hero/movie-hero-header";
import { MovieHeroMedia } from "@/features/movies/detail/hero/movie-hero-media";
import { MovieHeroActions } from "@/features/movies/detail/hero/movie-hero-actions";
export interface MovieHeroProps {
  staticContent: DetailStaticContent;
  movie: MovieDetailView;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  reviewCount?: number;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenPerson: (personId: number) => void;
  onOpenRating: () => void;
}

export function MovieHero({
  staticContent,
  movie,
  videos,
  cast,
  crew,
  reviewCount = 0,
  onOpenModal,
  onOpenPerson,
  onOpenRating,
}: MovieHeroProps) {
  const { sessionId } = useAuth();
  const [copiedShare, setCopiedShare] = useState(false);

  const { data: states } = useMediaAccountStatesQuery(
    "movie",
    movie.id,
    sessionId,
  );

  const isFavorite = Boolean(states?.favorite);
  const isWatchlist = Boolean(states?.watchlist);
  const userRating =
    typeof states?.rated === "object" && states?.rated !== null
      ? states.rated.value
      : states?.rated === true
        ? 10
        : null;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/assets/images/movie-placeholder.svg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : posterUrl;

  const playableVideos = useMemo(
    () => prioritizePlayableVideos(videos),
    [videos],
  );

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.overview,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <MovieHeroHeader
        staticContent={staticContent}
        movie={movie}
        userRating={userRating}
        onRateClick={onOpenRating}
        onShareClick={handleShareClick}
        copiedShare={copiedShare}
      />

      <MovieHeroMedia
        movieTitle={movie.title}
        posterUrl={posterUrl}
        backdropUrl={backdropUrl}
        playableVideos={playableVideos}
      />

      <MovieHeroActions
        staticContent={staticContent}
        movie={movie}
        cast={cast}
        crew={crew}
        reviewCount={reviewCount}
        isWatchlist={isWatchlist}
        isFavorite={isFavorite}
        userRating={userRating}
        onOpenModal={onOpenModal}
        onOpenPerson={onOpenPerson}
        onOpenRating={onOpenRating}
        onShareClick={handleShareClick}
        copiedShare={copiedShare}
      />
    </div>
  );
}
