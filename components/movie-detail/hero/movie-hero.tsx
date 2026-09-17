"use client";

import React, { useState, useMemo } from "react";
import { MovieDetailsData, Cast, Crew, Video } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useMovieAccountStatesQuery } from "@/hooks/use-tmdb";
import { MovieHeroHeader } from "./movie-hero-header";
import { MovieHeroMedia } from "./movie-hero-media";
import { MovieHeroActions } from "./movie-hero-actions";
import { MovieRatingDialog } from "./movie-rating-dialog";

export interface MovieHeroProps {
  movie: MovieDetailsData;
  certification?: string;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  reviewCount?: number;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating?: () => void;
}

export function MovieHero({
  movie,
  certification = "NR",
  videos,
  cast,
  crew,
  reviewCount = 0,
  onOpenModal,
  onOpenRating,
}: MovieHeroProps) {
  const { sessionId } = useAuth();
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleRateOpen = () => {
    if (onOpenRating) {
      onOpenRating();
    } else {
      setShowRatingModal(true);
    }
  };

  const { data: states, refetch: refetchStates } = useMovieAccountStatesQuery(
    movie.id,
    sessionId
  );

  const isFavorite = Boolean(states?.favorite);
  const isWatchlist = Boolean(states?.watchlist);
  const userRating =
    typeof states?.rated === "object" && states?.rated !== null
      ? states.rated.value
      : states?.rated === true
      ? 10
      : null;

  // Release year & runtime calculations
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";
  const runtimeHours = Math.floor((movie.runtime || 0) / 60);
  const runtimeMins = (movie.runtime || 0) % 60;
  const runtimeFormatted =
    runtimeHours > 0 ? `${runtimeHours}h ${runtimeMins}m` : `${runtimeMins}m`;

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/assets/images/movie-placeholder.png";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : posterUrl;

  // Prioritize trailers, then teasers, then others
  const playableVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    return [...videos].sort((a, b) => {
      const aScore = a.type === "Trailer" ? 2 : a.type === "Teaser" ? 1 : 0;
      const bScore = b.type === "Trailer" ? 2 : b.type === "Teaser" ? 1 : 0;
      return bScore - aScore;
    });
  }, [videos]);

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
        movie={movie}
        certification={certification}
        releaseYear={releaseYear}
        runtimeFormatted={runtimeFormatted}
        userRating={userRating}
        onRateClick={handleRateOpen}
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
        movie={movie}
        cast={cast}
        crew={crew}
        reviewCount={reviewCount}
        isWatchlist={isWatchlist}
        isFavorite={isFavorite}
        userRating={userRating}
        onOpenModal={onOpenModal}
        onOpenRating={handleRateOpen}
        onShareClick={handleShareClick}
      />

      <MovieRatingDialog
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        movieId={movie.id}
        movieTitle={movie.title}
        sessionId={sessionId}
        currentRating={userRating}
        onSuccess={() => refetchStates()}
      />
    </div>
  );
}

export default MovieHero;
