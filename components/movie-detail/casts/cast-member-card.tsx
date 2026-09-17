import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

export interface CastMemberCardProps {
  name: string;
  role: string;
  subtitle?: string;
  profilePath?: string | null;
}

export function CastMemberCard({
  name,
  role,
  subtitle,
  profilePath,
}: CastMemberCardProps) {
  const profileUrl = profilePath
    ? `https://image.tmdb.org/t/p/w185${profilePath}`
    : null;

  return (
    <div className="flex overflow-clip rounded-md border bg-card transition-colors hover:border-primary/50">
      {profileUrl ? (
        <div className="relative aspect-2/3 h-35 flex-none sm:h-40">
          <Image
            src={profileUrl}
            alt={name}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative flex aspect-2/3 h-35 flex-none items-center justify-center bg-secondary sm:h-40">
          <User size={40} className="text-muted-foreground" />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="truncate text-base font-bold">{name}</h3>
          <p className="truncate text-sm font-light text-muted-foreground">
            {role}
          </p>
        </div>
        {subtitle && (
          <p className="text-xs font-light text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default CastMemberCard;
