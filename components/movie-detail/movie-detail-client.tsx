"use client";

import React, { useState } from "react";
import {
  MovieDetailsData,
  Cast,
  Crew,
  Video,
  MovieImagesData,
} from "@/types";
import { useMovieReviewsQuery } from "@/hooks/use-tmdb";
import { MovieHero } from "./hero/movie-hero";
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
  const [initialPhotoIndex, setInitialPhotoIndex] = useState(0);
  const [initialVideoIndex, setInitialVideoIndex] = useState(0);

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
      {/* 1. Hero Showcase */}
      <div id="section-overview">
        <MovieHero
          movie={movie}
          certification={certification}
          videos={videos}
          cast={cast}
          crew={crew}
          reviewCount={totalReviews}
          onOpenModal={(m) => setActiveModal(m)}
        />
      </div>

      {/* Quick Access Sidebar / Floating Rail */}
      <MovieQuickRail
        movieId={movie.id}
        movieTitle={movie.title}
        onOpenModal={(m) => setActiveModal(m)}
      />

      <div className="container space-y-12 pb-16">
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

        {/* 6. Recommendations */}
        <div id="section-recommendations">{children}</div>
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
      />
    </div>
  );
}

// Backward-compatible alias
export const MoviePageClient = MovieDetailClient;

export default MovieDetailClient;
