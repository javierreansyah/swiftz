"use client";

import React, { useState } from "react";
import {
  MovieDetailsData,
  Cast,
  Crew,
  Video,
  MovieImagesData,
} from "@/types";
import {
  useMovieReviewsQuery,
  useMovieAccountStatesQuery,
} from "@/hooks/use-tmdb";
import { useAuth } from "@/components/providers/auth-provider";
import { MovieHero } from "./hero/movie-hero";
import { MovieRatingDialog } from "./hero/movie-rating-dialog";
import { MovieBottomModals, ModalType } from "./modals/movie-bottom-modals";
import { MovieQuickRail } from "./movie-quick-rail";
import { MovieCastSection } from "./sections/movie-cast-section";
import { MovieVideosSection } from "./sections/movie-videos-section";
import { MoviePhotosSection } from "./sections/movie-photos-section";
import { MovieReviewsSection } from "./sections/movie-reviews-section";

export interface MovieDetailClientProps {
  movie: MovieDetailsData;
  certification?: string;
  videos: Video[];
  cast: Cast[];
  crew: Crew[];
  images: MovieImagesData;
  children?: React.ReactNode;
}

export function MovieDetailClient({
  movie,
  certification = "NR",
  videos,
  cast,
  crew,
  images,
  children,
}: MovieDetailClientProps) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);
  const [initialVideoIndex, setInitialVideoIndex] = useState(0);

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

  const handleOpenPhoto = (index: number = 0) => {
    setInitialPhotoIndex(index);
    setActiveModal("photos");
  };

  const handleOpenVideo = (index: number = 0) => {
    setInitialVideoIndex(index);
    setActiveModal("videos");
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Hero Showcase with corner-to-corner blurred parallax backdrop */}
      <div id="section-overview">
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

      {/* Mobile Sticky Sub-Header Bar (only displayed on mobile when sidebar is NOT displayed) */}
      <div className="lg:hidden">
        <MovieQuickRail
          mode="mobile"
          movieId={movie.id}
          movieTitle={movie.title}
          onOpenModal={(m) => setActiveModal(m)}
          onOpenRating={() => setShowRatingModal(true)}
        />
      </div>

      {/* Main Content & Dedicated Desktop Sidebar Layout */}
      <div className="container pt-8 pb-20">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 xl:gap-10">
          {/* Main Movie Content Column */}
          <main className="min-w-0 space-y-12 lg:col-span-8 xl:col-span-9">
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

            {/* 6. Recommendations / Related */}
            <div id="section-recommendations">{children}</div>
          </main>

          {/* Dedicated Sticky Sidebar Column (Desktop) */}
          <aside className="sticky top-24 hidden self-start lg:col-span-4 lg:block xl:col-span-3">
            <MovieQuickRail
              mode="desktop"
              movieId={movie.id}
              movieTitle={movie.title}
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
