"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Film, Tv, SlidersHorizontal } from "lucide-react";
import { PersonCombinedCredits, PersonCastCredit, PersonCrewCredit } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PersonCreditsTimelineProps {
  credits: PersonCombinedCredits;
  primaryDepartment?: string;
}

interface UnifiedCreditItem {
  id: number;
  title: string;
  characterOrJob: string;
  episodeCount?: number;
  releaseYear: string | null;
  releaseYearSortKey: number;
  mediaType: "movie" | "tv";
  department: string;
  rawDate: string;
}

export function PersonCreditsTimeline({
  credits,
  primaryDepartment = "Acting",
}: PersonCreditsTimelineProps) {
  // Normalize Cast and Crew credits into a unified list
  const allCredits = useMemo<UnifiedCreditItem[]>(() => {
    const list: UnifiedCreditItem[] = [];

    // Cast entries
    (credits.cast || []).forEach((c) => {
      const date = c.release_date || c.first_air_date || "";
      const year = date ? date.substring(0, 4) : null;
      const sortKey = year ? parseInt(year, 10) : 9999; // unreleased goes first

      list.push({
        id: c.id,
        title: c.title || c.name || "Untitled",
        characterOrJob: c.character ? `as ${c.character}` : "Cast",
        episodeCount: c.episode_count,
        releaseYear: year,
        releaseYearSortKey: sortKey,
        mediaType: c.media_type || "movie",
        department: "Acting",
        rawDate: date,
      });
    });

    // Crew entries
    (credits.crew || []).forEach((cr) => {
      const date = cr.release_date || cr.first_air_date || "";
      const year = date ? date.substring(0, 4) : null;
      const sortKey = year ? parseInt(year, 10) : 9999;

      list.push({
        id: cr.id,
        title: cr.title || cr.name || "Untitled",
        characterOrJob: cr.job || cr.department || "Crew",
        episodeCount: cr.episode_count,
        releaseYear: year,
        releaseYearSortKey: sortKey,
        mediaType: cr.media_type || "movie",
        department: cr.department || "Production",
        rawDate: date,
      });
    });

    return list;
  }, [credits]);

  // Extract unique departments available for this person
  const availableDepartments = useMemo(() => {
    const deps = new Set<string>();
    allCredits.forEach((c) => {
      if (c.department) deps.add(c.department);
    });
    return Array.from(deps);
  }, [allCredits]);

  // Active filter states
  const [selectedDepartment, setSelectedDepartment] = useState<string>(() => {
    if (availableDepartments.includes(primaryDepartment)) {
      return primaryDepartment;
    }
    return availableDepartments[0] || "Acting";
  });

  const [selectedMediaType, setSelectedMediaType] = useState<"all" | "movie" | "tv">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort credits
  const filteredCredits = useMemo(() => {
    let result = allCredits;

    // Department filter
    if (selectedDepartment && selectedDepartment !== "all") {
      result = result.filter(
        (c) => c.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    // Media type filter
    if (selectedMediaType !== "all") {
      result = result.filter((c) => c.mediaType === selectedMediaType);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.characterOrJob.toLowerCase().includes(q)
      );
    }

    // Sort descending by releaseYearSortKey (unreleased 9999 first, then newest to oldest)
    result.sort((a, b) => {
      if (b.releaseYearSortKey !== a.releaseYearSortKey) {
        return b.releaseYearSortKey - a.releaseYearSortKey;
      }
      return b.rawDate.localeCompare(a.rawDate);
    });

    return result;
  }, [allCredits, selectedDepartment, selectedMediaType, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Title, Department Selector, Media Filter, and Search */}
      <div className="flex flex-col gap-3 rounded-none border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            {selectedDepartment} Credits ({filteredCredits.length})
          </h2>

          {/* Department Selector */}
          {availableDepartments.length > 1 && (
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="h-8 w-36 rounded-none bg-background text-xs">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {availableDepartments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Media Type Filter Pills */}
          <div className="flex items-center gap-1 rounded-none border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setSelectedMediaType("all")}
              className={`rounded-none px-2 py-1 text-xs font-semibold transition-all ${
                selectedMediaType === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedMediaType("movie")}
              className={`flex items-center gap-1 rounded-none px-2 py-1 text-xs font-semibold transition-all ${
                selectedMediaType === "movie"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Film className="size-3" />
              <span>Movies</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMediaType("tv")}
              className={`flex items-center gap-1 rounded-none px-2 py-1 text-xs font-semibold transition-all ${
                selectedMediaType === "tv"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Tv className="size-3" />
              <span>TV</span>
            </button>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credits..."
            className="h-8 rounded-none bg-background pr-3 pl-8 text-xs"
          />
        </div>
      </div>

      {/* Timeline Table / List */}
      {filteredCredits.length === 0 ? (
        <div className="flex h-32 items-center justify-center rounded-none border border-border bg-card p-6 text-xs text-muted-foreground">
          No credits matched your filter criteria.
        </div>
      ) : (
        <div className="overflow-hidden rounded-none border border-border bg-card">
          <div className="divide-y divide-border/60">
            {filteredCredits.map((credit, idx) => {
              const detailHref =
                credit.mediaType === "tv"
                  ? `/tv/${credit.id}`
                  : `/movie/${credit.id}`;

              const displayYear =
                credit.releaseYearSortKey === 9999
                  ? "—"
                  : credit.releaseYear || "—";

              return (
                <div
                  key={`${credit.id}-${credit.department}-${idx}`}
                  className="group flex items-start gap-4 p-3.5 transition-colors hover:bg-muted/40 sm:items-center sm:gap-6"
                >
                  {/* Year Column */}
                  <div className="w-12 shrink-0 text-xs font-bold text-muted-foreground sm:w-16">
                    {displayYear}
                  </div>

                  {/* Bullet Dot */}
                  <div className="mt-1 flex size-3 shrink-0 items-center justify-center sm:mt-0">
                    <span className="size-2 rounded-full border border-border bg-muted group-hover:border-primary group-hover:bg-primary" />
                  </div>

                  {/* Title & Role Column */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Link
                        href={detailHref}
                        className="text-sm font-bold text-foreground transition-colors hover:text-primary"
                      >
                        {credit.title}
                      </Link>

                      {credit.mediaType === "tv" && (
                        <span className="py-0.2 rounded-none bg-secondary px-1.5 text-[10px] font-semibold text-muted-foreground">
                          TV
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {credit.episodeCount && (
                        <span className="font-semibold text-foreground/80">
                          {credit.episodeCount} episodes{" "}
                        </span>
                      )}
                      <span>{credit.characterOrJob}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonCreditsTimeline;
