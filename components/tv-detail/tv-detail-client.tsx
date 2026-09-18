"use client";

import React, { useState } from "react";
import {
  TVShowDetailsData,
  Cast,
  Crew,
  Video,
  TVShow,
} from "@/types";
import { useAuth } from "@/components/providers/auth-provider";
import {
  useTVAccountStatesQuery,
  useTVReviewsQuery,
} from "@/hooks/use-tmdb";
import { MovieHeroBackdrop } from "@/components/movie-detail/hero/movie-hero-backdrop";
import { TVHero } from "./hero/tv-hero";
import { TVRatingDialog } from "./hero/tv-rating-dialog";
import { TVQuickRail } from "./tv-quick-rail";
import { TVSeasonsSection } from "./sections/tv-seasons-section";
import { TVCastSection } from "./sections/tv-cast-section";
import { TVVideosSection } from "./sections/tv-videos-section";
import { TVRecommendationsSection } from "./sections/tv-recommendations-section";
import { TVBottomModals, TVModalType } from "./modals/tv-bottom-modals";

export interface TVDetailClientProps {
  show: TVShowDetailsData;
  certification?: string;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  recommendations?: TVShow[];
}

export function TVDetailClient({
  show,
  certification = "NR",
  videos,
  cast,
  crew,
  recommendations = [],
}: TVDetailClientProps) {
  const [activeModal, setActiveModal] = useState<TVModalType>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [initialVideoIndex, setInitialVideoIndex] = useState(0);

  const { sessionId } = useAuth();
  const { data: accountStates, refetch: refetchStates } = useTVAccountStatesQuery(
    show.id,
    sessionId
  );

  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
      ? 10
      : null;

  const { data: reviewsData } = useTVReviewsQuery(show.id, 1);
  const reviews = reviewsData?.results || [];
  const totalReviews = reviewsData?.total_results || reviews.length;

  const handleOpenVideo = (index: number = 0) => {
    setInitialVideoIndex(index);
    setActiveModal("videos");
  };

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
    : "/assets/images/movie-placeholder.png";

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : posterUrl;

  return (
    <div className="relative min-h-screen">
      {/* Parallax blurred backdrop bleeding smoothly into background */}
      <MovieHeroBackdrop backdropUrl={backdropUrl} alt={show.name} />

      {/* Main Content & Dedicated Desktop Sticky Sidebar Layout */}
      <div className="relative z-10 container py-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_240px] xl:gap-10">
          {/* Main Column */}
          <main className="min-w-0 space-y-12">
            {/* 1. Hero Showcase (Overview) */}
            <div id="section-overview" className="scroll-mt-24">
              <TVHero
                show={show}
                certification={certification}
                videos={videos}
                cast={cast}
                crew={crew}
                reviewCount={totalReviews}
                onOpenModal={(m) => setActiveModal(m)}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* Mobile Quick Rail (Triggered by header compass) */}
            <div className="lg:hidden">
              <TVQuickRail
                mode="mobile"
                tvId={show.id}
                showTitle={show.name}
                onOpenModal={(m) => setActiveModal(m)}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* 2. Seasons Excerpt */}
            {show.seasons && show.seasons.length > 0 && (
              <TVSeasonsSection seasons={show.seasons} />
            )}

            {/* 3. Cast Excerpt */}
            <TVCastSection
              cast={cast}
              onOpenCastModal={() => setActiveModal("cast")}
            />

            {/* 4. Videos Excerpt */}
            <TVVideosSection
              videos={videos}
              onOpenVideosModal={handleOpenVideo}
            />

            {/* 5. Recommendations / Related */}
            {recommendations.length > 0 && (
              <TVRecommendationsSection shows={recommendations} />
            )}
          </main>

          {/* Dedicated Compact Sticky Sidebar (Desktop) */}
          <aside className="sticky top-24 hidden w-55 self-start lg:block xl:w-60">
            <TVQuickRail
              mode="desktop"
              tvId={show.id}
              showTitle={show.name}
              onOpenModal={(m) => setActiveModal(m)}
              onOpenRating={() => setShowRatingModal(true)}
            />
          </aside>
        </div>
      </div>

      {/* Bottom Modals */}
      <TVBottomModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        show={show}
        cast={cast}
        crew={crew}
        videos={videos}
        initialVideoIndex={initialVideoIndex}
      />

      {/* Unified Rating Dialog */}
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

export default TVDetailClient;
