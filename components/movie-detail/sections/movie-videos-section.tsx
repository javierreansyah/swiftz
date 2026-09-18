"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video } from "@/types";

export interface MovieVideosSectionProps {
  videos: Video[];
  onOpenVideosModal: (index?: number) => void;
}

export function MovieVideosSection({
  videos,
  onOpenVideosModal,
}: MovieVideosSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!videos || videos.length === 0) return null;

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -420, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 420, behavior: "smooth" });
  };

  return (
    <section id="section-videos" className="scroll-mt-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        {/* Left: Title + Desktop See all */}
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Videos
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenVideosModal(0)}
            className="hidden gap-1 text-xs font-semibold text-primary hover:text-primary sm:inline-flex"
          >
            <span>See all {videos.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        {/* Right: Mobile See all OR Desktop Carousel Arrows */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenVideosModal(0)}
            className="gap-1 text-xs font-semibold text-primary hover:text-primary sm:hidden"
          >
            <span>See all {videos.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>

          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="size-8 rounded-none"
              aria-label="Scroll videos left"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="size-8 rounded-none"
              aria-label="Scroll videos right"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {videos.map((vid, idx) => {
          const thumb = `https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`;
          return (
            <div
              key={vid.id}
              onClick={() => onOpenVideosModal(idx)}
              className="group w-72 shrink-0 cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg sm:w-80"
            >
              {/* Flush Video Thumbnail without inner padding */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <Image
                  src={thumb}
                  alt={vid.name}
                  fill
                  sizes="(max-width: 640px) 288px, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/10" />
                <div className="absolute top-1/2 left-1/2 flex size-10 -translate-1/2 items-center justify-center rounded-none bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 size-5 fill-current" />
                </div>
                <div className="absolute bottom-2.5 left-2.5 rounded-none border border-white/20 bg-black/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {vid.type || "Video"}
                </div>
              </div>

              {/* Title Content */}
              <div className="p-3">
                <h4 className="line-clamp-1 text-sm font-bold text-foreground group-hover:text-primary">
                  {vid.name}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MovieVideosSection;
