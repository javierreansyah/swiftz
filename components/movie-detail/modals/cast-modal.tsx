"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MovieDetailsData, Cast, Crew } from "@/types";

export interface CastModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: MovieDetailsData;
  cast: Cast[];
  crew: Crew[];
}

export function CastModal({
  isOpen,
  onClose,
  movie,
  cast,
  crew,
}: CastModalProps) {
  const releaseYear = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "";

  const [castTab, setCastTab] = useState<"all" | "cast" | "crew">("all");
  const [castSearch, setCastSearch] = useState("");

  const filteredCast = useMemo(() => {
    if (!castSearch.trim()) return cast;
    const q = castSearch.toLowerCase();
    return cast.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.character?.toLowerCase().includes(q)
    );
  }, [cast, castSearch]);

  const filteredCrew = useMemo(() => {
    if (!castSearch.trim()) return crew;
    const q = castSearch.toLowerCase();
    return crew.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.job?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q)
    );
  }, [crew, castSearch]);

  const crewByDepartment = useMemo(() => {
    const map: Record<string, Crew[]> = {};
    filteredCrew.forEach((c) => {
      const dept = c.department || "Other";
      if (!map[dept]) map[dept] = [];
      map[dept].push(c);
    });
    return map;
  }, [filteredCrew]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="h-[90vh] max-h-[92vh] rounded-t-3xl border-t border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl sm:max-w-none"
      >
        <div className="flex size-full flex-col">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground sm:text-xl">
                  {movie.title}{" "}
                  {releaseYear && (
                    <span className="font-normal text-muted-foreground">
                      ({releaseYear})
                    </span>
                  )}
                </SheetTitle>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:text-sm">
                  Full Cast & Crew
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search cast or crew..."
                  value={castSearch}
                  onChange={(e) => setCastSearch(e.target.value)}
                  className="h-8 pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Sub-tabs: All, Cast, Crew */}
          <div className="flex gap-2 border-b border-border/60 bg-muted/30 px-6 py-2.5 text-xs sm:text-sm">
            <Button
              variant={castTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCastTab("all")}
              className="rounded-full"
            >
              All ({cast.length + crew.length})
            </Button>
            <Button
              variant={castTab === "cast" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCastTab("cast")}
              className="rounded-full"
            >
              Cast ({cast.length})
            </Button>
            <Button
              variant={castTab === "crew" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCastTab("crew")}
              className="rounded-full"
            >
              Crew ({crew.length})
            </Button>
          </div>

          {/* Cast & Crew Content Grid */}
          <ScrollArea className="flex-1 p-6">
            {/* Cast section */}
            {(castTab === "all" || castTab === "cast") && (
              <div className="space-y-4 pb-8">
                <h3 className="text-lg font-bold text-foreground">
                  Cast ({filteredCast.length})
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {filteredCast.map((c) => {
                    const profileUrl = c.profile_path
                      ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                      : null;
                    return (
                      <div
                        key={c.id + (c.character || "")}
                        className="group overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-colors hover:border-primary/40"
                      >
                        <div className="relative aspect-[2/3] w-full bg-muted">
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
              </div>
            )}

            {/* Crew section */}
            {(castTab === "all" || castTab === "crew") && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground">
                  Crew by Department ({filteredCrew.length})
                </h3>
                {Object.entries(crewByDepartment).map(([dept, members]) => (
                  <div
                    key={dept}
                    className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-5"
                  >
                    <h4 className="font-bold text-primary">{dept}</h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {members.map((m, idx) => (
                        <div
                          key={m.credit_id || idx}
                          className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-card p-2.5 text-xs"
                        >
                          <span className="font-semibold text-foreground">
                            {m.name}
                          </span>
                          <span className="text-muted-foreground">
                            {m.job || dept}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CastModal;
