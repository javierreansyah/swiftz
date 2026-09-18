import React from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { Person } from "@/types";

export interface PersonCardProps {
  person: Person;
}

export function PersonCard({ person }: PersonCardProps) {
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
    : null;

  const topWorks = person.known_for
    ?.map((w) => w.title || w.name)
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");

  return (
    <Link href={`/person/${person.id}`} prefetch={false} className="group block">
      <div className="overflow-clip rounded-none border border-border bg-card transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
        {profileUrl ? (
          <div className="relative aspect-2/3 w-full bg-muted">
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-opacity duration-300"
            />
          </div>
        ) : (
          <div className="relative flex aspect-2/3 w-full items-center justify-center bg-secondary">
            <User className="size-12 text-muted-foreground" />
          </div>
        )}

        <div className="flex h-24 flex-col justify-between space-y-1 p-3.5">
          <div>
            <h2 className="line-clamp-1 text-sm leading-tight font-bold text-foreground transition-colors group-hover:text-primary">
              {person.name}
            </h2>
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {person.known_for_department || "Actor"}
            </p>
          </div>

          {topWorks && (
            <p className="line-clamp-1 text-[11px] text-muted-foreground/80">
              {topWorks}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default PersonCard;
