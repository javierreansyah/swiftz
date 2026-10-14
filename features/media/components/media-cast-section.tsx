"use client";
import type { Cast } from "@/lib/tmdb/types/common";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/features/media/components/media-card";
export interface MediaCastSectionProps {
  cast: Cast[];
  onOpenCastModal: () => void;
  onSelectPerson?: (personId: number) => void;
  title?: string;
}

export function MediaCastSection({
  cast,
  onOpenCastModal,
  onSelectPerson,
  title = "Top Cast",
}: MediaCastSectionProps) {
  if (!cast || cast.length === 0) return null;

  return (
    <ContentCarousel
      id="section-cast"
      title={title}
      action={{
        label: `See all ${cast.length}`,
        onClick: onOpenCastModal,
      }}
    >
      {cast.map((c) => (
        <MediaCard
          key={c.id + (c.character || "")}
          type="person"
          id={c.id}
          title={c.name}
          subtitle={c.character || "Actor"}
          image={c.profile_path}
          onClick={
            onSelectPerson ? () => onSelectPerson(c.id) : onOpenCastModal
          }
          variant="shelf"
        />
      ))}
    </ContentCarousel>
  );
}
