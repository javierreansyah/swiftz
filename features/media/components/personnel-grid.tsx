"use client";
import { MediaCard } from "@/features/media/components/media-card";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
interface PersonnelGridProps {
  title: string;
  people: (Cast | Crew)[];
  onNavigate?: () => void;
}

export function PersonnelGrid({
  title,
  people,
  onNavigate,
}: PersonnelGridProps) {
  if (people.length === 0) return null;

  return (
    <section className="space-y-4" aria-label={title}>
      <h3 className="border-b border-border/50 pb-2 label-section">
        {title} ({people.length})
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {people.map((person, index) => (
          <MediaCard
            key={`${person.credit_id || person.id}-${index}`}
            type="person"
            id={person.id}
            title={person.name}
            subtitle={
              "character" in person
                ? person.character || "Actor"
                : person.job || person.department
            }
            image={person.profile_path}
            href={`/person/${person.id}`}
            onClick={onNavigate}
            variant="grid"
          />
        ))}
      </div>
    </section>
  );
}
