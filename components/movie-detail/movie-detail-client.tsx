"use client";

import React, { useState } from "react";
import {
  MovieDetailsData,
  Cast,
  Crew,
  Video,
  MovieImagesData,
  Movie,
} from "@/types";
import {
  useMovieReviewsQuery,
  useMovieAccountStatesQuery,
} from "@/hooks/use-tmdb";
import { useAuth } from "@/components/providers/auth-provider";
import { MovieHero } from "./hero/movie-hero";
import { MovieHeroBackdrop } from "./hero/movie-hero-backdrop";
import { MovieRatingDialog } from "./hero/movie-rating-dialog";
import { MovieBottomModals, ModalType } from "./modals/movie-bottom-modals";
import { MovieQuickRail } from "./movie-quick-rail";
import { MovieCastSection } from "./sections/movie-cast-section";
import { MovieVideosSection } from "./sections/movie-videos-section";
import { MoviePhotosSection } from "./sections/movie-photos-section";
import { MovieReviewsSection } from "./sections/movie-reviews-section";
import { MovieCollectionSection } from "./sections/movie-collection-section";
import { MovieRecommendationsSection } from "./sections/movie-recommendations-section";

export interface MovieDetailClientProps {
  movie: MovieDetailsData;
  certification?: string;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  images: MovieImagesData;
  recommendations?: Movie[];
  children?: React.ReactNode;
}

export function MovieDetailClient({
  movie,
  certification = "NR",
  videos,
  cast,
  crew,
  images,
  recommendations = [],
  children,
}: MovieDetailClientProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState<number | undefined>(undefined);
  const [initialVideoIndex, setInitialVideoIndex] = useState<number | undefined>(undefined);

  const { sessionId } = useAuth();
  const { data: accountStates, refetch: refetchStates } =
    useMovieAccountStatesQuery(movie.id, sessionId);

  const userRating =
    typeof accountStates?.rated === "object" && accountStates?.rated !== null
      ? accountStates.rated.value
      : accountStates?.rated === true
      ? 10
      : null;

  // Client query for reviews count & sample
  const { data: reviewsData } = useMovieReviewsQuery(movie.id, 1);
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
    : "/assets/images/movie-placeholder.png";

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : posterUrl;

  return (
    <div className="relative min-h-screen">
      {/* Corner-to-corner blurred parallax backdrop bleeding smoothly down into page background */}
      <MovieHeroBackdrop backdropUrl={backdropUrl} alt={movie.title} />

      {/* Main Content & Dedicated Desktop Sidebar Layout starting from the top */}
      <div className="relative z-10 container py-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_240px] xl:gap-10">
          {/* Main Movie Content Column */}
          <main className="min-w-0 space-y-12">
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
            <MoviePhotosSection
              movieTitle={movie.title}
              images={images}
              onOpenPhotosModal={handleOpenPhoto}
            />

            {/* 5. Reviews Excerpt */}
            <MovieReviewsSection
              reviews={reviews}
              totalReviews={totalReviews}
              onOpenReviewsModal={() => setActiveModal("reviews")}
            />

            {/* 6. Franchise / Collection Excerpt */}
            {movie.belongs_to_collection && (
              <MovieCollectionSection
                collection={movie.belongs_to_collection}
                onOpenCollectionModal={() => setActiveModal("collection")}
              />
            )}

            {/* 7. Recommendations / Related */}
            {recommendations.length > 0 ? (
              <MovieRecommendationsSection
                movies={recommendations}
                onOpenRecommendationsModal={() => setActiveModal("recommendations")}
              />
            ) : (
              children && <div id="section-recommendations" className="scroll-mt-24">{children}</div>
            )}
          </main>

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

export default MovieDetailClient;
