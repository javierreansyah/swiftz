"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Star, Calendar, Layers } from "lucide-react";
import { TVShowDetailsData, Video } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrailerModal } from "@/components/common/trailer-modal";

export interface TVDetailClientHeroProps {
  show: TVShowDetailsData;
  videos: Video[];
}

export function TVDetailClientHero({ show, videos }: TVDetailClientHeroProps) {
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const backdropUrl = show.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}`
    : show.poster_path
    ? `https://image.tmdb.org/t/p/w1280${show.poster_path}`
    : null;

  const posterUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : null;

  const startYear = show.first_air_date ? show.first_air_date.substring(0, 4) : "";
  const endYear = show.status === "Ended" && show.last_air_date
    ? show.last_air_date.substring(0, 4)
    : show.status === "Returning Series"
    ? "Present"
    : "";
  const yearSpan = startYear ? (endYear ? `${startYear}–${endYear}` : startYear) : "";

  return (
    <section className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Background Backdrop with Gradient Overlays */}
      {backdropUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backdropUrl}
            alt={show.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 blur-xs filter"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background via-neutral-950/80 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-neutral-950 via-neutral-950/60 to-transparent" />
        </div>
      )}

      {/* Hero Content Container */}
      <div className="relative z-10 container py-8 lg:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start lg:gap-12">
          {/* Poster Column */}
          {posterUrl && (
            <div className="relative aspect-2/3 w-48 shrink-0 overflow-hidden border border-white/20 shadow-2xl sm:w-60 lg:w-72">
              <Image
                src={posterUrl}
                alt={show.name}
                fill
                priority
                sizes="(max-width: 640px) 192px, 288px"
                className="object-cover"
              />
            </div>
          )}

          {/* Details Column */}
          <div className="flex-1 space-y-4">
            {/* Title & Tagline */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-amber-400">
                <span className="flex items-center gap-1 rounded-none bg-amber-400/20 px-2 py-0.5 text-amber-300">
                  <Star className="size-3 fill-current" />
                  {show.vote_average.toFixed(1)} ({show.vote_count.toLocaleString()} votes)
                </span>
                {yearSpan && (
                  <span className="flex items-center gap-1 text-white/80">
                    <Calendar className="size-3" />
                    {yearSpan}
                  </span>
                )}
                <span className="text-white/40">&bull;</span>
                <span className="text-white/80">{show.status}</span>
                <span className="text-white/40">&bull;</span>
                <span className="flex items-center gap-1 text-white/80">
                  <Layers className="size-3" />
                  {show.number_of_seasons} Seasons ({show.number_of_episodes} Episodes)
                </span>
              </div>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                {show.name}
              </h1>

              {show.tagline && (
                <p className="mt-1 text-sm text-amber-400/90 italic sm:text-base">
                  &ldquo;{show.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Genres */}
            {show.genres && show.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {show.genres.map((g) => (
                  <Badge
                    key={g.id}
                    variant="outline"
                    className="rounded-none border-white/20 bg-white/5 text-white/90"
                  >
                    {g.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                onClick={() => setIsTrailerOpen(true)}
                className="gap-2 rounded-none bg-amber-400 font-bold text-neutral-950 hover:bg-amber-300"
              >
                <Play className="size-4 fill-current" />
                <span>Watch Trailer</span>
              </Button>

              {show.homepage && (
                <Button
                  variant="outline"
                  asChild
                  className="gap-2 rounded-none border-white/30 bg-black/40 text-white hover:bg-white/10"
                >
                  <a
                    href={show.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Official Site
                  </a>
                </Button>
              )}
            </div>

            {/* Overview */}
            <div className="space-y-1.5 pt-2">
              <h2 className="text-sm font-bold tracking-wider text-neutral-400 uppercase">
                Overview
              </h2>
              <p className="max-w-3xl text-sm leading-relaxed text-white/80 sm:text-base">
                {show.overview || "No overview available for this series."}
              </p>
            </div>

            {/* Networks & Creators */}
            <div className="flex flex-wrap gap-8 border-t border-white/10 pt-4 text-xs sm:text-sm">
              {show.created_by && show.created_by.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-neutral-400">
                    Created By
                  </span>
                  <span className="font-bold text-white">
                    {show.created_by.map((c) => c.name).join(", ")}
                  </span>
                </div>
              )}

              {show.networks && show.networks.length > 0 && (
                <div>
                  <span className="block text-xs font-semibold text-neutral-400">
                    Original Network
                  </span>
                  <span className="font-bold text-white">
                    {show.networks.map((n) => n.name).join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Dialog */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={show.name}
        mediaId={show.id}
        mediaType="tv"
      />
    </section>
  );
}

export default TVDetailClientHero;
