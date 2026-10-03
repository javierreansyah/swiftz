"use client";
import { useState } from "react";
import type { TVShowDetailsData } from "@/lib/tmdb/types/tv";
import { useAuth } from "@/features/auth/auth-provider";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import {
  useTVReviewsQuery,
  useTVCreditsQuery,
  useTVVideosQuery,
  useTVRecommendationsQuery,
} from "@/features/tv/hooks/queries";
import { useVisible } from "@/hooks/use-visible";
import { MovieHeroBackdrop } from "@/features/movies/detail/hero/movie-hero-backdrop";
import { TVHero } from "@/features/tv/detail/hero/tv-hero";
import { TVRatingDialog } from "@/features/tv/detail/hero/tv-rating-dialog";
import { TVQuickRail } from "@/features/tv/detail/tv-quick-rail";
import { TVSeasonsSection } from "@/features/tv/detail/sections/tv-seasons-section";
import { TVCastSection } from "@/features/tv/detail/sections/tv-cast-section";
import { TVVideosSection } from "@/features/tv/detail/sections/tv-videos-section";
import { TVRecommendationsSection } from "@/features/tv/detail/sections/tv-recommendations-section";
import {
  type TVModalType,
  TVBottomModals,
} from "@/features/tv/detail/modals/tv-bottom-modals";
export interface TVDetailClientProps {
  show: TVShowDetailsData;
  certification?: string;
}

export function TVDetailClient({
  show,
  certification = "NR",
}: TVDetailClientProps) {
  const [activeModal, setActiveModal] = useState<TVModalType>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [initialVideoIndex, setInitialVideoIndex] = useState<
    number | undefined
  >(undefined);
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<
    number | undefined
  >(undefined);
  const recommendationsSection = useVisible();
  const { data: creditsData } = useTVCreditsQuery(show.id);
  const { data: videoData } = useTVVideosQuery(show.id);
  const { data: recommendationsData } = useTVRecommendationsQuery(
    show.id,
    1,
    recommendationsSection.visible || activeModal === "recommendations",
  );
  const cast = creditsData?.cast || [];
  const crew = creditsData?.crew || [];
  const videos = videoData?.results || [];
  const recommendations = recommendationsData?.results || [];

  const { sessionId } = useAuth();
  const { data: accountStates, refetch: refetchStates } =
    useMediaAccountStatesQuery("tv", show.id, sessionId);

  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
        ? 10
        : null;

  const { data: reviewsData } = useTVReviewsQuery(
    show.id,
    1,
    activeModal === "reviews",
  );
  const reviews = reviewsData?.results || [];
  const totalReviews = reviewsData?.total_results || reviews.length;

  const handleOpenVideo = (index?: number) => {
    setInitialVideoIndex(index);
    setActiveModal("videos");
  };

  const handleOpenSeason = (seasonNumber?: number) => {
    setSelectedSeasonNumber(
      seasonNumber ?? show.seasons?.[0]?.season_number ?? 1,
    );
    setActiveModal("seasons");
  };

  const handleModalOpen = (modal: TVModalType) => {
    if (modal === "seasons") {
      handleOpenSeason();
    } else {
      if (modal === "videos") setInitialVideoIndex(undefined);
      setActiveModal(modal);
    }
  };

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w780${show.poster_path}`
    : "/assets/images/movie-placeholder.svg";

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : posterUrl;

  return (
    <div className="relative min-h-screen">
      {/* Parallax blurred backdrop bleeding smoothly into background */}
      <MovieHeroBackdrop backdropUrl={backdropUrl} alt={show.name} />

      {/* Main Content & Dedicated Desktop Sticky Sidebar Layout */}
      <div className="relative z-10 container py-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-detail xl:grid-cols-detail-wide xl:gap-10">
          {/* Main Column */}
          <div className="min-w-0 space-y-12">
            {/* 1. Hero Showcase (Overview) */}
            <div id="section-overview" className="scroll-mt-24">
              <TVHero
                show={show}
                certification={certification}
                videos={videos}
                cast={cast}
                crew={crew}
                reviewCount={totalReviews}
                onOpenModal={handleModalOpen}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* Mobile Quick Rail (Triggered by header compass) */}
            <div className="lg:hidden">
              <TVQuickRail
                mode="mobile"
                tvId={show.id}
                showTitle={show.name}
                onOpenModal={handleModalOpen}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* 2. Seasons Excerpt */}
            {show.seasons && show.seasons.length > 0 && (
              <TVSeasonsSection
                seasons={show.seasons}
                onOpenSeason={handleOpenSeason}
              />
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
            <div ref={recommendationsSection.ref}>
              {recommendations.length > 0 && (
                <TVRecommendationsSection
                  shows={recommendations}
                  totalCount={recommendationsData?.total_results}
                  onOpenRecommendationsModal={() =>
                    setActiveModal("recommendations")
                  }
                />
              )}
            </div>
          </div>

          {/* Dedicated Compact Sticky Sidebar (Desktop) */}
          <aside className="sticky top-24 hidden w-55 self-start lg:block xl:w-60">
            <TVQuickRail
              mode="desktop"
              tvId={show.id}
              showTitle={show.name}
              onOpenModal={handleModalOpen}
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
        selectedSeasonNumber={selectedSeasonNumber}
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
