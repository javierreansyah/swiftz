"use client";

import React from "react";
import Image from "next/image";
import { Layers, ChevronRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";

import { SectionHeader } from "@/components/common/section-header";

export interface MovieCollectionSectionProps {
  collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  };
  onOpenCollectionModal: () => void;
}

export function MovieCollectionSection({
  collection,
  onOpenCollectionModal,
}: MovieCollectionSectionProps) {
  if (!collection) return null;

  const backdropUrl = collection.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${collection.backdrop_path}`
    : collection.poster_path
    ? `https://image.tmdb.org/t/p/w780${collection.poster_path}`
    : null;

  const posterUrl = collection.poster_path
    ? `https://image.tmdb.org/t/p/w342${collection.poster_path}`
    : null;

  return (
    <section id="section-collection" className="scroll-mt-24 space-y-4 pt-4">
      {/* Standardized Serif Section Header */}
      <SectionHeader
        title="Franchise"
        action={{
          label: "Explore Collection",
          onClick: onOpenCollectionModal,
        }}
      />

      {/* Cinematic Banner Card */}
      <div
        onClick={onOpenCollectionModal}
        className="group relative cursor-pointer overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/50 hover:shadow-xl"
      >
        {/* Background Image with Gradient Mask */}
        {backdropUrl && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={backdropUrl}
              alt={collection.name}
              fill
              className="object-cover opacity-20 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/50" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6 lg:p-8">
          {/* Mini Poster */}
          {posterUrl && (
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-none border border-border/60 bg-muted shadow-md sm:w-24">
              <Image
                src={posterUrl}
                alt={collection.name}
                fill
                sizes="96px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary uppercase">
              <Layers className="size-3.5" />
              <span>Part of the Franchise</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground group-hover:text-primary sm:text-xl lg:text-2xl">
              {collection.name}
            </h3>
            <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              This movie belongs to a larger cinematic collection. Explore all parts, chronological release order, and ratings.
            </p>
          </div>

          {/* Action CTA Button */}
          <div className="shrink-0 pt-2 sm:pt-0">
            <Button
              variant="default"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCollectionModal();
              }}
              className="gap-2 font-semibold shadow-md"
            >
              <Layers className="size-4" />
              <span>View Collection</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MovieCollectionSection;
