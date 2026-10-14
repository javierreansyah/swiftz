"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Image from "@/components/ui/image";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import type { Video } from "@/lib/tmdb/types/common";
import { cn } from "@/lib/utils";
export interface MediaHeroMediaProps {
  title: string;
  posterUrl: string;
  backdropUrl: string;
  playableVideos: Video[];
  className?: string;
}

export function MediaHeroMedia({
  title,
  posterUrl,
  backdropUrl,
  playableVideos,
  className,
}: MediaHeroMediaProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const currentVideo = playableVideos[activeVideoIndex] || null;

  const handlePrevVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setHasInteracted(true);
    setActiveVideoIndex((prev) =>
      prev === 0 ? playableVideos.length - 1 : prev - 1,
    );
  };

  const handleNextVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingTrailer(false);
    setHasInteracted(true);
    setActiveVideoIndex((prev) =>
      prev === playableVideos.length - 1 ? 0 : prev + 1,
    );
  };

  const activeImageSrc =
    hasInteracted && currentVideo?.site === "YouTube" && currentVideo?.key
      ? `https://img.youtube.com/vi/${currentVideo.key}/hqdefault.jpg`
      : backdropUrl;

  return (
    <div
      className={cn(
        "grid grid-cols-1 items-stretch gap-6 lg:grid-cols-hero",
        className,
      )}
    >
      {/* Left Column: Vertical Poster (Static, matches height of 16:9 trailer) */}
      <div className="hidden h-full lg:block">
        <div className="relative aspect-2/3 size-full overflow-hidden rounded-3xl bg-card shadow-2xl">
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 1024px) 100vw, 360px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Right Column: Interactive Trailer / Video Hero */}
      <div className="-mx-4 h-full sm:mx-0">
        <div className="relative aspect-video size-full overflow-hidden rounded-none bg-scrim shadow-2xl sm:rounded-xl">
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
                alt={currentVideo?.name || title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                variant={hasInteracted ? "preview" : "hero"}
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-scrim/80 via-scrim/20 to-transparent" />

              {/* Floating Trailer Play Button Container (Bottom-Left) */}
              {currentVideo && (
                <Button
                  size="sm"
                  type="button"
                  onClick={() => setIsPlayingTrailer(true)}
                  className="absolute bottom-4 left-4 sm:left-6"
                  aria-label="Play Trailer"
                >
                  <Play className="size-4 fill-current" />
                  <span>Watch Trailer</span>
                </Button>
              )}

              {/* Carousel Chevron Controls on Bottom Right (Desktop Only) */}
              {playableVideos.length > 1 && (
                <div className="absolute right-4 bottom-4 hidden shrink-0 items-center gap-1.5 lg:flex">
                  <Button
                    variant="media"
                    size="icon-sm"
                    type="button"
                    onClick={handlePrevVideo}
                    aria-label="Previous Video"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="media"
                    size="icon-sm"
                    type="button"
                    onClick={handleNextVideo}
                    aria-label="Next Video"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
