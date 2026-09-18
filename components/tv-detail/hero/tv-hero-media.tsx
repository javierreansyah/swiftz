"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Video } from "@/types";
import { cn } from "@/lib/utils";

export interface TVHeroMediaProps {
  showTitle: string;
  posterUrl: string;
  backdropUrl: string;
  playableVideos: Video[];
}

export function TVHeroMedia({
  showTitle,
  posterUrl,
  backdropUrl,
  playableVideos,
}: TVHeroMediaProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentVideo = playableVideos[activeVideoIndex] || null;

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setHasInteracted(true);
    setActiveVideoIndex((prev) =>
      prev === 0 ? playableVideos.length - 1 : prev - 1
    );
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setHasInteracted(true);
    setActiveVideoIndex((prev) =>
      prev === playableVideos.length - 1 ? 0 : prev + 1
    );
  };

  const activeImageSrc =
    hasInteracted && currentVideo?.site === "YouTube" && currentVideo?.key
      ? `https://img.youtube.com/vi/${currentVideo.key}/hqdefault.jpg`
      : backdropUrl;

  return (
    <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[3fr_8fr]">
      {/* Left Column: Vertical Poster (Static, matches height of 16:9 trailer) */}
      <div className="hidden h-full lg:block">
        <div className="relative aspect-2/3 size-full overflow-hidden rounded-none border border-border bg-card shadow-2xl">
          <Image
            src={posterUrl}
            alt={showTitle}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Column: Interactive Trailer / Video Hero */}
      <div className="h-full">
        <div className="relative aspect-video size-full overflow-hidden rounded-none border border-border bg-black shadow-2xl">
          {isPlayingTrailer && currentVideo ? (
            <iframe
              src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&rel=0`}
              title={currentVideo.name || "Trailer"}
              className="size-full border-0 object-contain"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* YouTube Thumbnail Preview or Backdrop Banner */}
              <Image
                key={hasInteracted ? currentVideo?.key || "banner" : "banner"}
                src={activeImageSrc}
                alt={currentVideo?.name || showTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className={cn(
                  "transition-all duration-500",
                  hasInteracted
                    ? "object-contain object-center"
                    : "object-cover object-center brightness-80"
                )}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

              {/* Mobile Poster Thumbnail (visible on small screens) */}
              <div className="absolute bottom-4 left-4 flex items-end gap-3 lg:hidden">
                <div className="relative h-28 w-20 flex-none overflow-hidden rounded-none border border-white/20 shadow-xl">
                  <Image
                    src={posterUrl}
                    alt={showTitle}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Trailer Play Button Container (Bottom-Left) */}
              {currentVideo && (
                <button
                  onClick={() => setIsPlayingTrailer(true)}
                  className="group absolute bottom-4 left-26 flex cursor-pointer items-center gap-2.5 rounded-none border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-black/90 sm:left-6 sm:text-sm"
                  aria-label="Play Trailer"
                >
                  <div className="flex size-6 items-center justify-center rounded-none bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
                    <Play className="ml-0.5 size-3.5 fill-current" />
                  </div>
                  <span className="max-w-50 truncate sm:max-w-xs">
                    {currentVideo.type || "Trailer"} · {currentVideo.name}
                  </span>
                </button>
              )}

              {/* Carousel Chevron Controls on Bottom Right */}
              {playableVideos.length > 1 && (
                <div className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-none border border-white/20 bg-black/60 p-1 backdrop-blur-md">
                  <button
                    onClick={handlePrevVideo}
                    className="flex size-7 items-center justify-center rounded-none text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    aria-label="Previous Video"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="px-1 text-xs font-semibold text-white/90">
                    {activeVideoIndex + 1}/{playableVideos.length}
                  </span>
                  <button
                    onClick={handleNextVideo}
                    className="flex size-7 items-center justify-center rounded-none text-white/80 transition-colors hover:bg-white/20 hover:text-white"
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

export default TVHeroMedia;
