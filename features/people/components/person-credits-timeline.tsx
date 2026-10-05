"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Film, Tv } from "lucide-react";
import type { PersonCombinedCredits } from "@/lib/tmdb/types/people";
import { usePersonCombinedCreditsQuery } from "@/features/people/hooks/queries";
import { useVisible } from "@/hooks/use-visible";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/features/media/components/filter-sidebar-primitives";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
export interface PersonCreditsTimelineProps {
  credits: PersonCombinedCredits;
  primaryDepartment?: string;
}

/** Keep the potentially huge full filmography out of the serialized RSC payload. */
export function PersonCreditsTimelineLoader({
  personId,
  primaryDepartment,
}: {
  personId: number;
  primaryDepartment?: string;
}) {
  const { ref, visible } = useVisible();
  const query = usePersonCombinedCreditsQuery(personId, visible);

  return (
    <div ref={ref}>
      {query.data ? (
        <PersonCreditsTimeline
          key={personId}
          credits={query.data}
          primaryDepartment={primaryDepartment}
        />
      ) : (
        <section className="space-y-4" aria-busy={!query.isError}>
          <h2 className="heading-section">Career Credits</h2>
          {query.isError ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Unable to load career credits.
              </p>
              <Button variant="outline" onClick={() => query.refetch()}>
                Try again
              </Button>
            </div>
          ) : (
            <Skeleton className="h-64 w-full" />
          )}
        </section>
      )}
    </div>
  );
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

  const [selectedMediaType, setSelectedMediaType] = useState<
    "all" | "movie" | "tv"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort credits
  const filteredCredits = useMemo(() => {
    let result = [...allCredits];

    // Department filter
    if (selectedDepartment && selectedDepartment !== "all") {
      result = result.filter(
        (c) => c.department.toLowerCase() === selectedDepartment.toLowerCase(),
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
          c.characterOrJob.toLowerCase().includes(q),
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

  // Group sorted credits by release year so the year is only rendered once per group
  interface YearGroup {
    year: string;
    sortKey: number;
    items: UnifiedCreditItem[];
  }

  const yearGroups = useMemo<YearGroup[]>(() => {
    const groups: YearGroup[] = [];
    let currentGroup: YearGroup | null = null;

    filteredCredits.forEach((credit) => {
      const displayYear =
        credit.releaseYearSortKey === 9999 ? "—" : credit.releaseYear || "—";

      if (!currentGroup || currentGroup.year !== displayYear) {
        currentGroup = {
          year: displayYear,
          sortKey: credit.releaseYearSortKey,
          items: [credit],
        };
        groups.push(currentGroup);
      } else {
        currentGroup.items.push(credit);
      }
    });

    return groups;
  }, [filteredCredits]);

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card">
      {/* Controls Bar / Header: Title, Department Selector, Media Filter, and Search */}
      <div className="flex flex-col gap-3 border-b border-border bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="heading-section text-foreground">
            {selectedDepartment} Credits ({filteredCredits.length})
          </h2>

          {/* Department Selector */}
          {availableDepartments.length > 1 && (
            <FilterSelect
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              placeholder="Department"
              fullWidth={false}
              className="w-36"
              options={[
                { value: "all", label: "All Departments" },
                ...availableDepartments.map((dept) => ({
                  value: dept,
                  label: dept,
                })),
              ]}
            />
          )}

          {/* Media Type Filter Tabs (Shadcn Default) */}
          <Tabs
            value={selectedMediaType}
            onValueChange={(val) =>
              setSelectedMediaType(val as "all" | "movie" | "tv")
            }
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="all" className="cursor-pointer">
                All
              </TabsTrigger>
              <TabsTrigger value="movie" className="cursor-pointer">
                <Film className="size-3" />
                <span>Movies</span>
              </TabsTrigger>
              <TabsTrigger value="tv" className="cursor-pointer">
                <Tv className="size-3" />
                <span>TV</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full sm:w-56">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            leadingIcon
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credits..."
          />
        </div>
      </div>

      {/* Timeline Table / List */}
      {filteredCredits.length === 0 ? (
        <div className="flex h-32 items-center justify-center p-6 text-xs text-muted-foreground">
          No credits matched your filter criteria.
        </div>
      ) : (
        <div>
          {yearGroups.map((group, groupIdx) => (
            <div
              key={`${group.year}-${groupIdx}`}
              className="flex border-b border-border/60 last:border-b-0"
            >
              {/* Year Column - rendered ONCE per year group */}
              <div className="w-14 shrink-0 border-r border-border/40 p-3.5 text-xs font-bold text-muted-foreground select-none sm:w-20 sm:p-4 sm:text-sm">
                <span className="font-mono">{group.year}</span>
              </div>

              {/* Credits List for this Year */}
              <div className="min-w-0 flex-1 divide-y divide-border/40">
                {group.items.map((credit, idx) => {
                  const detailHref =
                    credit.mediaType === "tv"
                      ? `/tv/${credit.id}`
                      : `/movie/${credit.id}`;

                  return (
                    <Link
                      key={`${credit.id}-${credit.department}-${credit.characterOrJob}-${idx}`}
                      href={detailHref}
                      prefetch={false}
                      className="group flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-muted/40 sm:items-center sm:gap-4 sm:px-4"
                    >
                      {/* Bullet Dot */}
                      <div className="mt-1 flex size-3 shrink-0 items-center justify-center sm:mt-0">
                        <span className="size-2 rounded-full border border-border bg-muted transition-colors group-hover:border-primary group-hover:bg-primary" />
                      </div>

                      {/* Title & Role Column */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                            {credit.title}
                          </span>

                          {credit.mediaType === "tv" && (
                            <span className="rounded-xl bg-secondary px-1.5 py-0.5 text-xs font-semibold text-muted-foreground">
                              TV
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {credit.episodeCount ? (
                            <span className="font-semibold text-foreground/80">
                              {credit.episodeCount} episode
                              {credit.episodeCount > 1 ? "s" : ""}{" "}
                            </span>
                          ) : null}
                          <span>{credit.characterOrJob}</span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
