"use client";
import Image from "@/components/ui/image";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/common/section-header";
import { useMovieCollectionQuery } from "@/features/movies/hooks/queries";
import { useVisible } from "@/hooks/use-visible";
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
  const { ref, visible } = useVisible();
  const { data: details } = useMovieCollectionQuery(collection?.id, visible);

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
      <SectionHeader title="Collection" />

      {/* Cinematic Banner Card */}
      <div
        ref={ref}
        onClick={onOpenCollectionModal}
        className="group relative cursor-pointer overflow-hidden rounded-3xl bg-card/60 shadow-xs transition-all hover:shadow-xl"
      >
        {/* Background Image with Gradient Mask */}
        {backdropUrl && (
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src={backdropUrl}
              alt={collection.name}
              fill
              variant="collection"
            />
            <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/50" />
          </div>
        )}

        <div className="relative z-10 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6 lg:p-8">
          {/* Mini Poster */}
          {posterUrl && (
            <div className="relative aspect-2/3 w-20 shrink-0 overflow-hidden rounded-xl bg-muted shadow-md sm:w-24">
              <Image
                src={posterUrl}
                alt={collection.name}
                fill
                sizes="96px"
                variant="thumbnail"
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 space-y-2">
            <h3 className="heading-card text-foreground group-hover:text-primary">
              {collection.name}
            </h3>
            {details?.overview && (
              <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                {details.overview}
              </p>
            )}
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
