import React from "react";
import Image from "next/image";
import { Users, ChevronRight, User } from "lucide-react";
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
  const topCast = cast.slice(0, 6);

  return (
    <section id="section-cast" className="space-y-4 pt-4">
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <h2 className="text-xl font-bold sm:text-2xl">Top Cast</h2>
          <span className="text-xs text-muted-foreground">({cast.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenCastModal}
          className="gap-1 text-xs font-semibold text-primary hover:text-primary"
        >
          <span>View all cast & crew</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {topCast.map((c) => {
          const profileUrl = c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null;
          return (
            <div
              key={c.id + c.character}
              onClick={onOpenCastModal}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative aspect-2/3 w-full bg-muted">
                {profileUrl ? (
                  <Image
                    src={profileUrl}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 185px"
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
