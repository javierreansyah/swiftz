"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "@/types";

export interface MovieHeroMediaProps {
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  playableVideos: Video[];
}

export function MovieHeroMedia({
  movieTitle,
  posterUrl,
  backdropUrl,
  playableVideos,
}: MovieHeroMediaProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const currentVideo = playableVideos[activeVideoIndex] || null;

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setActiveVideoIndex((prev) =>
      prev === 0 ? playableVideos.length - 1 : prev - 1
    );
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setActiveVideoIndex((prev) =>
      prev === playableVideos.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Vertical Poster (Static, not hoverable) */}
      <div className="hidden lg:col-span-4 lg:block xl:col-span-3">
        <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl">
          <Image
            src={posterUrl}
            alt={movieTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Column: Interactive Trailer / Video Hero */}
      <div className="lg:col-span-8 xl:col-span-9">
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-2xl">
          {isPlayingTrailer && currentVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&rel=0`}
              title={currentVideo.name || "Trailer"}
              className="size-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Backdrop Preview with dark gradient */}
              <Image
                src={backdropUrl}
                alt={movieTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover object-center brightness-75 transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Mobile Poster Thumbnail (visible on small screens) */}
              <div className="absolute bottom-4 left-4 flex items-end gap-3 lg:hidden">
                <div className="relative h-28 w-20 flex-none overflow-hidden rounded-lg border border-white/20 shadow-xl">
                  <Image
                    src={posterUrl}
                    alt={movieTitle}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Center Play Button */}
              {currentVideo && (
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="group absolute top-1/2 left-1/2 flex size-16 -translate-1/2 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-primary sm:size-20"
                  aria-label="Play Trailer"
                >
                  <Play className="ml-1 size-7 fill-current transition-transform duration-300 group-hover:scale-110 sm:size-9" />
                </button>
              )}

              {/* Floating Trailer Pill */}
              {currentVideo && (
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute bottom-4 left-26 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:bg-black/80 sm:left-6 sm:text-sm"
                >
                  <Play className="size-3.5 fill-white text-white" />
                  <span className="max-w-50 truncate sm:max-w-xs">
                    {currentVideo.type || "Trailer"} · {currentVideo.name}
                  </span>
                </button>
              )}

              {/* Carousel Chevron Controls on Bottom Right */}
              {playableVideos.length > 1 && (
                <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 p-1 backdrop-blur-md">
                  <button
                    onClick={handlePrevVideo}
                    className="flex size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Previous Video"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="px-1 text-xs font-semibold text-white/90">
                    {activeVideoIndex + 1}/{playableVideos.length}
                  </span>
                  <button
                    onClick={handleNextVideo}
                    className="flex size-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Next Video"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieHeroMedia;
