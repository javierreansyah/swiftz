import React from "react";
import Image from "next/image";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TMDBAccount } from "@/types/auth";

export interface LibraryHeaderProps {
  user: TMDBAccount;
  avatarUrl: string | null;
  onLogout: () => void;
}

export function LibraryHeader({
  user,
  avatarUrl,
  onLogout,
}: LibraryHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card/60 p-6 shadow-lg backdrop-blur-md sm:p-8">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-start">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
          {/* Avatar */}
          {avatarUrl ? (
            <div className="relative size-20 flex-none overflow-clip rounded-2xl shadow-md ring-2 ring-primary/30 sm:size-24">
              <Image
                src={avatarUrl}
                alt={user.name || user.username}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-20 flex-none items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/30 to-primary/10 text-2xl font-black text-primary shadow-md sm:size-24">
              {(user.username || "U").charAt(0).toUpperCase()}
            </div>
          )}

          {/* User Meta */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                {user.name || user.username}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                TMDB Connected
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              @{user.username} • TMDB ID #{user.id}
            </p>

            {/* Action Links */}
            <div className="flex items-center justify-center gap-3 pt-1 sm:justify-start">
              <a
                href={`https://www.themoviedb.org/u/${user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>View on TMDB</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-xs hover:border-red-500/40 hover:text-red-500"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LibraryHeader;
