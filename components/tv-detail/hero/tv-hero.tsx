"use client";

import React, { useState, useMemo } from "react";
import { TVShowDetailsData, Cast, Crew, Video } from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import { useTVAccountStatesQuery } from "@/hooks/use-tmdb";
import { TVHeroHeader } from "./tv-hero-header";
import { TVHeroMedia } from "./tv-hero-media";
import { TVHeroActions } from "./tv-hero-actions";
import { TVRatingDialog } from "./tv-rating-dialog";

export interface TVHeroProps {
  show: TVShowDetailsData;
  certification?: string;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  reviewCount?: number;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating?: () => void;
}

export function TVHero({
  show,
  certification = "NR",
  videos,
  cast,
  reviewCount = 0,
  onOpenModal,
  onOpenRating,
}: TVHeroProps) {
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

  const { data: states, refetch: refetchStates } = useTVAccountStatesQuery(
    show.id,
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

  // Air years calculation: e.g. 2011–2019 or 2024–
  const startYear = show.first_air_date ? show.first_air_date.substring(0, 4) : "";
  const endYear = show.last_air_date ? show.last_air_date.substring(0, 4) : "";
  const airYears = startYear
    ? show.in_production
      ? `${startYear}–`
      : startYear === endYear
      ? startYear
      : `${startYear}–${endYear}`
    : "";

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
    : "/assets/images/movie-placeholder.png";

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : posterUrl;

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
          title: show.name,
          text: show.overview,
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
      <TVHeroHeader
        show={show}
        certification={certification}
        airYears={airYears}
        seasonsCount={show.number_of_seasons || show.seasons?.length || 1}
        episodesCount={show.number_of_episodes || 0}
        userRating={userRating}
        onRateClick={handleRateOpen}
        onShareClick={handleShareClick}
        copiedShare={copiedShare}
      />

      <TVHeroMedia
        showTitle={show.name}
        posterUrl={posterUrl}
        backdropUrl={backdropUrl}
        playableVideos={playableVideos}
      />

      <TVHeroActions
        show={show}
        cast={cast}
        reviewCount={reviewCount}
        isWatchlist={isWatchlist}
        isFavorite={isFavorite}
        userRating={userRating}
        onOpenModal={onOpenModal}
        onOpenRating={handleRateOpen}
        onShareClick={handleShareClick}
      />

      <TVRatingDialog
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        tvId={show.id}
        showTitle={show.name}
        sessionId={sessionId}
        currentRating={userRating}
        onSuccess={() => refetchStates()}
      />
    </div>
  );
}

export default TVHero;
