"use client";
import type { DetailStaticContent } from "@/features/media/detail-static-content";
import { useState, useMemo } from "react";
import { prioritizePlayableVideos } from "@/features/media/videos";
import type { TVDetailView } from "@/features/tv/detail/payload";
import type { Cast, Crew, Video } from "@/lib/tmdb/types/common";
import { useAuth } from "@/features/auth/auth-provider";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import { TVHeroHeader } from "@/features/tv/detail/hero/tv-hero-header";
import { TVHeroMedia } from "@/features/tv/detail/hero/tv-hero-media";
import { TVHeroActions } from "@/features/tv/detail/hero/tv-hero-actions";
export interface TVHeroProps {
  staticContent: DetailStaticContent;
  show: TVDetailView;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  reviewCount?: number;
  onOpenModal: (modal: "reviews" | "videos" | "photos" | "cast") => void;
  onOpenRating: () => void;
}

export function TVHero({
  staticContent,
  show,
  videos,
  cast,
  reviewCount = 0,
  onOpenModal,
  onOpenRating,
}: TVHeroProps) {
  const { sessionId } = useAuth();
  const [copiedShare, setCopiedShare] = useState(false);

  const { data: states } = useMediaAccountStatesQuery("tv", show.id, sessionId);

  const isFavorite = Boolean(states?.favorite);
  const isWatchlist = Boolean(states?.watchlist);
  const userRating =
    typeof states?.rated === "object" && states?.rated !== null
      ? states.rated.value
      : states?.rated === true
        ? 10
        : null;

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
    : "/assets/images/movie-placeholder.svg";

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : posterUrl;

  const playableVideos = useMemo(
    () => prioritizePlayableVideos(videos),
    [videos],
  );

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
        staticContent={staticContent}
        show={show}
        userRating={userRating}
        onRateClick={onOpenRating}
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
        staticContent={staticContent}
        show={show}
        cast={cast}
        reviewCount={reviewCount}
        isWatchlist={isWatchlist}
        isFavorite={isFavorite}
        userRating={userRating}
        onOpenModal={onOpenModal}
        onOpenRating={onOpenRating}
        onShareClick={handleShareClick}
        copiedShare={copiedShare}
      />
    </div>
  );
}
