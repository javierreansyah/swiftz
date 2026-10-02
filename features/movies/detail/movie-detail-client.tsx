"use client";
import React, { useState } from "react";
import type { MovieDetailsData } from "@/lib/tmdb/types/movie";
import {
  useMovieReviewsQuery,
  useMovieCastQuery,
  useMovieVideosQuery,
  useMovieImagesQuery,
  useMovieRecommendationsQuery,
} from "@/features/movies/hooks/queries";
import { useMediaAccountStatesQuery } from "@/features/auth/hooks/queries";
import { useVisible } from "@/hooks/use-visible";
import { useAuth } from "@/features/auth/auth-provider";
import { MovieHero } from "@/features/movies/detail/hero/movie-hero";
import { MovieHeroBackdrop } from "@/features/movies/detail/hero/movie-hero-backdrop";
import { MovieRatingDialog } from "@/features/movies/detail/hero/movie-rating-dialog";
import {
  type ModalType,
  MovieBottomModals,
} from "@/features/movies/detail/modals/movie-bottom-modals";
import { MovieQuickRail } from "@/features/movies/detail/movie-quick-rail";
import { MovieCastSection } from "@/features/movies/detail/sections/movie-cast-section";
import { MovieVideosSection } from "@/features/movies/detail/sections/movie-videos-section";
import { MoviePhotosSection } from "@/features/movies/detail/sections/movie-photos-section";
import { MovieReviewsSection } from "@/features/movies/detail/sections/movie-reviews-section";
import { MovieCollectionSection } from "@/features/movies/detail/sections/movie-collection-section";
import { MovieRecommendationsSection } from "@/features/movies/detail/sections/movie-recommendations-section";
export interface MovieDetailClientProps {
  movie: MovieDetailsData;
  certification?: string;
  children?: React.ReactNode;
}

export function MovieDetailClient({
  movie,
  certification = "NR",
  children,
}: MovieDetailClientProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState<
    number | undefined
  >(undefined);
  const [initialVideoIndex, setInitialVideoIndex] = useState<
    number | undefined
  >(undefined);
  const photosSection = useVisible();
  const reviewsSection = useVisible();
  const recommendationsSection = useVisible();

  // Hero resources are client-fetched; heavier galleries are fetched on visibility/open.
  const { data: creditsData } = useMovieCastQuery(String(movie.id));
  const { data: videoData } = useMovieVideosQuery(movie.id);
  const { data: imagesData } = useMovieImagesQuery(
    movie.id,
    photosSection.visible || activeModal === "photos",
  );
  const { data: recommendationsData } = useMovieRecommendationsQuery(
    String(movie.id),
    1,
    recommendationsSection.visible || activeModal === "recommendations",
  );
  const cast = creditsData?.cast || [];
  const crew = creditsData?.crew || [];
  const videos = videoData?.results || [];
  const images = imagesData || {
    id: movie.id,
    backdrops: [],
    posters: [],
    logos: [],
  };
  const recommendations = recommendationsData?.results || [];

  const { sessionId } = useAuth();
  const { data: accountStates, refetch: refetchStates } =
    useMediaAccountStatesQuery("movie", movie.id, sessionId);

  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
        ? 10
        : null;

  // Client query for reviews count & sample
  const { data: reviewsData } = useMovieReviewsQuery(
    movie.id,
    1,
    reviewsSection.visible || activeModal === "reviews",
  );
  const reviews = reviewsData?.results || [];
  const totalReviews = reviewsData?.total_results || reviews.length;

  const handleOpenPhoto = (index?: number) => {
    setInitialPhotoIndex(index);
    setActiveModal("photos");
  };

  const handleOpenVideo = (index?: number) => {
    setInitialVideoIndex(index);
    setActiveModal("videos");
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w780${movie.poster_path}`
    : "/assets/images/movie-placeholder.svg";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : posterUrl;

  return (
    <div className="relative min-h-screen">
      {/* Corner-to-corner blurred parallax backdrop bleeding smoothly down into page background */}
      <MovieHeroBackdrop backdropUrl={backdropUrl} alt={movie.title} />

      {/* Main Content & Dedicated Desktop Sidebar Layout starting from the top */}
      <div className="relative z-10 container py-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-detail xl:grid-cols-detail-wide xl:gap-10">
          {/* Main Movie Content Column */}
          <div className="min-w-0 space-y-12">
            {/* 1. Hero Showcase (Overview) */}
            <div id="section-overview" className="scroll-mt-24">
              <MovieHero
                movie={movie}
                certification={certification}
                videos={videos}
                cast={cast}
                crew={crew}
                reviewCount={totalReviews}
                onOpenModal={(m) => setActiveModal(m)}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* Mobile Collapsible Dropdown below Header (Triggered by Compass Button) */}
            <div className="lg:hidden">
              <MovieQuickRail
                mode="mobile"
                movieId={movie.id}
                movieTitle={movie.title}
                hasCollection={Boolean(movie.belongs_to_collection)}
                onOpenModal={(m) => setActiveModal(m)}
                onOpenRating={() => setShowRatingModal(true)}
              />
            </div>

            {/* 2. Cast Excerpt */}
            <MovieCastSection
              cast={cast}
              onOpenCastModal={() => setActiveModal("cast")}
            />

            {/* 3. Videos Excerpt */}
            <MovieVideosSection
              videos={videos}
              onOpenVideosModal={handleOpenVideo}
            />

            {/* 4. Photos Excerpt */}
            <div ref={photosSection.ref}>
              <MoviePhotosSection
                movieTitle={movie.title}
                images={images}
                onOpenPhotosModal={handleOpenPhoto}
              />
            </div>

            {/* 5. Reviews Excerpt */}
            <div ref={reviewsSection.ref}>
              <MovieReviewsSection
                reviews={reviews}
                totalReviews={totalReviews}
                onOpenReviewsModal={() => setActiveModal("reviews")}
              />
            </div>

            {/* 6. Franchise / Collection Excerpt */}
            {movie.belongs_to_collection && (
              <MovieCollectionSection
                collection={movie.belongs_to_collection}
                onOpenCollectionModal={() => setActiveModal("collection")}
              />
            )}

            {/* 7. Recommendations / Related */}
            <div ref={recommendationsSection.ref}>
              {recommendations.length > 0 ? (
                <MovieRecommendationsSection
                  movies={recommendations}
                  onOpenRecommendationsModal={() =>
                    setActiveModal("recommendations")
                  }
                />
              ) : (
                children && (
                  <div id="section-recommendations" className="scroll-mt-24">
                    {children}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dedicated Compact Sticky Sidebar Column (Desktop): Starts at the top alongside Hero, always sticky */}
          <aside className="sticky top-24 hidden w-55 self-start lg:block xl:w-60">
            <MovieQuickRail
              mode="desktop"
              movieId={movie.id}
              movieTitle={movie.title}
              hasCollection={Boolean(movie.belongs_to_collection)}
              onOpenModal={(m) => setActiveModal(m)}
              onOpenRating={() => setShowRatingModal(true)}
            />
          </aside>
        </div>
      </div>

      {/* Bottom Modals (Reviews, Videos, Photos, Cast) */}
      <MovieBottomModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        movie={movie}
        cast={cast}
        crew={crew}
        videos={videos}
        images={images}
        initialPhotoIndex={initialPhotoIndex}
        initialVideoIndex={initialVideoIndex}
        onOpenRating={() => setShowRatingModal(true)}
      />

      {/* Unified Rating Dialog */}
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

// Backward-compatible alias
export const MoviePageClient = MovieDetailClient;
