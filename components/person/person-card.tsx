import React from "react";
import { Person } from "@/types";
import { MediaCard } from "@/components/common/media-card";

export interface PersonCardProps {
  person: Person;
  variant?: "shelf" | "grid";
  className?: string;
}

export function PersonCard({
  person,
  variant = "grid",
  className,
}: PersonCardProps) {
  const topWorks = person.known_for
    ?.map((w) => w.title || w.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  const subtitle = topWorks
    ? `${person.known_for_department || "Actor"} · ${topWorks}`
    : person.known_for_department || "Actor";

  return (
    <MediaCard
      type="person"
      id={person.id}
      title={person.name}
      subtitle={subtitle}
      image={person.profile_path}
      href={`/person/${person.id}`}
      variant={variant}
      className={className}
    />
  );
}

export default PersonCard;
