"use client";

import React from "react";
import { Person } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

export interface BornTodayCarouselProps {
  people: Person[];
}

export function BornTodayCarousel({ people }: BornTodayCarouselProps) {
  if (!people || people.length === 0) return null;

  return (
    <div className="container">
      <ContentCarousel
        title="Born Today & Popular Stars"
        action={{ label: "Explore People", href: "/person" }}
      >
        {people.map((person) => {
          const topWork = person.known_for?.[0]?.title || person.known_for?.[0]?.name;
          const subtitle = topWork
            ? `${person.known_for_department || "Actor"} · ${topWork}`
            : person.known_for_department || "Actor";

          return (
            <MediaCard
              key={person.id}
              type="person"
              id={person.id}
              title={person.name}
              subtitle={subtitle}
              image={person.profile_path}
              href={`/person/${person.id}`}
              variant="shelf"
            />
          );
        })}
      </ContentCarousel>
    </div>
  );
}

export default BornTodayCarousel;
