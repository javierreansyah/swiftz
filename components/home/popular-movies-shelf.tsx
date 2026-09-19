"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import { Movie } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";
import { TrailerModal } from "@/components/common/trailer-modal";

export interface PopularMoviesShelfProps {
  movies: Movie[];
}

export function PopularMoviesShelf({ movies }: PopularMoviesShelfProps) {
  const [trailerModal, setTrailerModal] = useState<{
    isOpen: boolean;
    mediaId: number;
    title: string;
  }>({
    isOpen: false,
    mediaId: 0,
    title: "",
  });

  if (!movies || movies.length === 0) return null;

  return (
    <div className="container">
      <ContentCarousel
        title="Popular Movies"
        action={{ label: "Explore all", href: "/popular" }}
      >
        {movies.map((movie) => {
          const year = movie.release_date
            ? movie.release_date.substring(0, 4)
            : undefined;

          return (
            <MediaCard
              key={movie.id}
              type="movie"
              id={movie.id}
              title={movie.title}
              image={movie.poster_path}
              rating={movie.vote_average}
              year={year}
              href={`/movie/${movie.id}`}
              variant="shelf"
              actionIcon={<Play className="size-3.5 fill-current" />}
              actionTitle="Watch Trailer"
              onActionClick={() =>
                setTrailerModal({
                  isOpen: true,
                  mediaId: movie.id,
                  title: movie.title,
                })
              }
            />
          );
        })}
      </ContentCarousel>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerModal.isOpen}
        onClose={() =>
          setTrailerModal({
            isOpen: false,
            mediaId: 0,
            title: "",
          })
        }
        title={trailerModal.title}
        mediaId={trailerModal.mediaId}
        mediaType="movie"
      />
    </div>
  );
}

export default PopularMoviesShelf;
