"use client";
import type { DetailStaticContent } from "@/features/media/detail-static-content";
import React, { useState } from "react";
import type { MovieDetailView } from "@/features/movies/detail/payload";
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
import { QueryFeedback } from "@/features/media/components/query-feedback";
import { MediaRatingDialog } from "@/features/media/components/media-rating-dialog";
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
  staticContent: DetailStaticContent;
  movie: MovieDetailView;
  children?: React.ReactNode;
}

export function MovieDetailClient({
  staticContent,
  movie,
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
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const photosSection = useVisible();
  const reviewsSection = useVisible();
  const recommendationsSection = useVisible();

  // Hero resources are client-fetched; heavier galleries are fetched on visibility/open.
  const creditsQuery = useMovieCastQuery(String(movie.id));
  const videoQuery = useMovieVideosQuery(movie.id);
  const imagesQuery = useMovieImagesQuery(
    movie.id,
    photosSection.visible || activeModal === "photos",
  );
  const recommendationsQuery = useMovieRecommendationsQuery(
    String(movie.id),
    1,
    recommendationsSection.visible || activeModal === "recommendations",
  );
  const creditsData = creditsQuery.data;
  const videoData = videoQuery.data;
  const recommendationsData = recommendationsQuery.data;
  const imagesData = imagesQuery.data;
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

  const { sessionId, isAuthenticated, login } = useAuth();
  function handleOpenRating() {
    if (isAuthenticated) setShowRatingModal(true);
    else void login();
  }
  const { data: accountStates } = useMediaAccountStatesQuery(
    "movie",
    movie.id,
    sessionId,
  );

  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
        ? 10
        : null;

  // Client query for reviews count & sample
  const reviewsQuery = useMovieReviewsQuery(
    movie.id,
    1,
    reviewsSection.visible || activeModal === "reviews",
  );
  const reviewsData = reviewsQuery.data;
  const reviews = reviewsData?.results || [];
  const totalReviews = reviewsData?.total_results || reviews.length;

  const castError = creditsQuery.isError && (
    <QueryFeedback
      hasData={Boolean(creditsQuery.data)}
      onRetry={() => void creditsQuery.refetch()}
    />
  );
  const videosError = videoQuery.isError && (
    <QueryFeedback
      hasData={Boolean(videoQuery.data)}
      onRetry={() => void videoQuery.refetch()}
    />
  );
  const photosError = imagesQuery.isError && (
    <QueryFeedback
      hasData={Boolean(imagesQuery.data)}
      onRetry={() => void imagesQuery.refetch()}
    />
  );

  const handleOpenPhoto = (index?: number) => {
    setInitialPhotoIndex(index);
    setActiveModal("photos");
  };

  const handleOpenVideo = (index?: number) => {
    setInitialVideoIndex(index);
    setActiveModal("videos");
  };

  const handleOpenModal = (modal: ModalType) => {
    if (modal === "photos") setInitialPhotoIndex(undefined);
    if (modal === "videos") setInitialVideoIndex(undefined);
    if (modal === "cast") setSelectedPersonId(null);
    setActiveModal(modal);
  };

  const handleOpenPerson = (id: number) => {
    setSelectedPersonId(id);
    setActiveModal("cast");
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
                staticContent={staticContent}
                movie={movie}
                videos={videos}
                cast={cast}
                crew={crew}
                reviewCount={totalReviews}
                onOpenModal={handleOpenModal}
                onOpenPerson={handleOpenPerson}
                onOpenRating={handleOpenRating}
              />
            </div>

            {/* Mobile Collapsible Dropdown below Header (Triggered by Compass Button) */}
            <div className="lg:hidden">
              <MovieQuickRail
                mode="mobile"
                movieId={movie.id}
                movieTitle={movie.title}
                hasCollection={Boolean(movie.belongs_to_collection)}
                onOpenRating={handleOpenRating}
              />
            </div>

            {castError}
            {/* 2. Cast Excerpt */}
            <MovieCastSection
              cast={cast}
              onOpenCastModal={() => handleOpenModal("cast")}
              onSelectPerson={handleOpenPerson}
            />

            {videosError}
            {/* 3. Videos Excerpt */}
            <MovieVideosSection
              videos={videos}
              onOpenVideosModal={handleOpenVideo}
            />

            {/* 4. Photos Excerpt */}
            <div ref={photosSection.ref}>
              {photosError}
              <MoviePhotosSection
                movieTitle={movie.title}
                images={images}
                onOpenPhotosModal={handleOpenPhoto}
              />
            </div>

            {/* 5. Reviews Excerpt */}
            <div ref={reviewsSection.ref}>
              {reviewsQuery.isError && (
                <QueryFeedback
                  hasData={Boolean(reviewsQuery.data)}
                  onRetry={() => void reviewsQuery.refetch()}
                />
              )}
              <MovieReviewsSection
                reviews={reviews}
                totalReviews={totalReviews}
                onOpenReviewsModal={() => setActiveModal("reviews")}
              />
            </div>

            {/* 6. Collection */}
            {movie.belongs_to_collection && (
              <MovieCollectionSection
                collection={movie.belongs_to_collection}
                onOpenCollectionModal={() => setActiveModal("collection")}
              />
            )}

            {/* 7. Recommendations / Related */}
            <div ref={recommendationsSection.ref}>
              {recommendationsQuery.isError && (
                <QueryFeedback
                  hasData={Boolean(recommendationsQuery.data)}
                  onRetry={() => void recommendationsQuery.refetch()}
                />
              )}
              {recommendations.length > 0 ? (
                <MovieRecommendationsSection
                  movies={recommendations}
                  totalCount={recommendationsData?.total_results}
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
          <aside className="sticky top-24 hidden w-50 self-start lg:block xl:w-55">
            <MovieQuickRail
              mode="desktop"
              movieId={movie.id}
              movieTitle={movie.title}
              hasCollection={Boolean(movie.belongs_to_collection)}
              onOpenRating={handleOpenRating}
            />
          </aside>
        </div>
      </div>

      {/* Bottom Modals (Reviews, Videos, Photos, Cast) */}
      <MovieBottomModals
        castError={castError}
        videosError={videosError}
        photosError={photosError}
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        movie={movie}
        cast={cast}
        crew={crew}
        videos={videos}
        images={images}
        initialPhotoIndex={initialPhotoIndex}
        initialVideoIndex={initialVideoIndex}
        selectedPersonId={selectedPersonId}
      />

      {/* Unified Rating Dialog */}
      <MediaRatingDialog
        mediaType="movie"
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        mediaId={movie.id}
        title={movie.title}
        sessionId={sessionId}
        currentRating={userRating}
      />
    </div>
  );
}
