"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieImagesData } from "@/types";

export interface MoviePhotosSectionProps {
  movieTitle: string;
  images?: MovieImagesData;
  onOpenPhotosModal: (index?: number) => void;
}

export function MoviePhotosSection({
  movieTitle,
  images,
  onOpenPhotosModal,
}: MoviePhotosSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const backdrops = images?.backdrops || [];
  if (backdrops.length === 0) return null;

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -420, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 420, behavior: "smooth" });
  };

  return (
    <section id="section-photos" className="scroll-mt-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        {/* Left: Title + Desktop See all */}
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Photo Gallery
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenPhotosModal(0)}
            className="hidden gap-1 text-xs font-semibold text-primary hover:text-primary sm:inline-flex"
          >
            <span>See all {backdrops.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        {/* Right: Mobile See all OR Desktop Carousel Arrows */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenPhotosModal(0)}
            className="gap-1 text-xs font-semibold text-primary hover:text-primary sm:hidden"
          >
            <span>See all {backdrops.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="size-8 rounded-none"
              aria-label="Scroll photos left"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="size-8 rounded-none"
              aria-label="Scroll photos right"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Large Photos Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {backdrops.map((photo, i) => (
          <div
            key={photo.file_path + i}
            onClick={() => onOpenPhotosModal(i)}
            className="group relative aspect-video w-72 shrink-0 cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-xl sm:w-96"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w780${photo.file_path}`}
              alt={`${movieTitle} Photo`}
              fill
              sizes="(max-width: 640px) 288px, 384px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default MoviePhotosSection;
