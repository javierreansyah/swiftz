"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Cast } from "@/types";

export interface MovieCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
}

export function MovieCastSection({
  cast,
  onOpenCastModal,
}: MovieCastSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!cast || cast.length === 0) return null;

  const scrollPrev = () => {
    scrollContainerRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const scrollNext = () => {
    scrollContainerRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section id="section-cast" className="scroll-mt-24 space-y-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        {/* Left: Title + Desktop See all button */}
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
            Top Cast
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCastModal}
            className="hidden gap-1 text-xs font-semibold text-primary hover:text-primary sm:inline-flex"
          >
            <span>See all {cast.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>
        </div>

        {/* Right side: Mobile See all button OR Desktop Carousel arrows */}
        <div className="flex items-center gap-1.5">
          {/* Mobile See all button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenCastModal}
            className="gap-1 text-xs font-semibold text-primary hover:text-primary sm:hidden"
          >
            <span>See all {cast.length}</span>
            <ChevronRight className="size-3.5" />
          </Button>

          {/* Desktop Carousel Arrows */}
          <div className="hidden items-center gap-1 sm:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="size-8 rounded-none"
              aria-label="Scroll cast left"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="size-8 rounded-none"
              aria-label="Scroll cast right"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex scrollbar-none gap-3.5 overflow-x-auto scroll-smooth pb-2"
      >
        {cast.map((c) => {
          const profileUrl = c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null;
          return (
            <div
              key={c.id + (c.character || "")}
              onClick={onOpenCastModal}
              className="group w-36 shrink-0 cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg sm:w-44"
            >
              {/* 4:5 Aspect Ratio Portrait */}
              <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 144px, 176px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <User className="size-10" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="truncate text-sm font-bold text-foreground">
                  {c.name}
                </h4>
                <p className="truncate text-xs text-muted-foreground">
                  {c.character}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default MovieCastSection;
