"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMovieCastQuery } from "@/hooks/use-tmdb";
import { CastMemberCard } from "@/components/movie-detail/casts/cast-member-card";
import { CastSkeletonGrid } from "@/components/movie-detail/casts/cast-skeleton-grid";

interface MovieCastPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function MovieCastPage({ params }: MovieCastPageProps) {
  const { id } = use(params);
  const { data: movieCast, isLoading, isError } = useMovieCastQuery(id);

  const [activeTab, setActiveTab] = useState<"all" | "cast" | "crew">("all");
  const [searchFilter, setSearchFilter] = useState("");

  const castList = useMemo(() => movieCast?.cast || [], [movieCast]);
  const crewList = useMemo(() => movieCast?.crew || [], [movieCast]);

  const filteredCast = useMemo(() => {
    if (!searchFilter.trim()) return castList;
    const term = searchFilter.toLowerCase();
    return castList.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.character?.toLowerCase().includes(term)
    );
  }, [castList, searchFilter]);

  const filteredCrew = useMemo(() => {
    if (!searchFilter.trim()) return crewList;
    const term = searchFilter.toLowerCase();
    return crewList.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.job?.toLowerCase().includes(term) ||
        c.department?.toLowerCase().includes(term)
    );
  }, [crewList, searchFilter]);

  return (
    <main className="container min-h-screen space-y-8 pt-20 pb-12">
      {/* Header with back button */}
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/movie/${id}`}>
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to movie</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold sm:text-4xl md:text-5xl">
              Cast &amp; Crew
            </h1>
            <p className="text-sm text-muted-foreground">
              {castList.length} Cast Members · {crewList.length} Crew Members
            </p>
          </div>
        </div>

        {/* Search filter input */}
        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cast or crew..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("all")}
        >
          All ({castList.length + crewList.length})
        </Button>
        <Button
          variant={activeTab === "cast" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("cast")}
        >
          Cast ({castList.length})
        </Button>
        <Button
          variant={activeTab === "crew" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab("crew")}
        >
          Crew ({crewList.length})
        </Button>
      </div>

      {isLoading ? (
        <CastSkeletonGrid />
      ) : isError || (!castList.length && !crewList.length) ? (
        <div className="flex h-62.5 w-full items-center justify-center rounded-lg border bg-card p-8">
          <h2 className="text-xl font-medium">No cast or crew information found.</h2>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === "all" || activeTab === "cast") &&
            filteredCast.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Cast ({filteredCast.length})</h2>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCast.map((cast, index) => (
                    <li key={cast.id ? `cast-${cast.id}-${index}` : index}>
                      <CastMemberCard
                        name={cast.name}
                        role={cast.character || "Unknown Character"}
                        subtitle={`Popularity: ${Number(cast.popularity).toFixed(1)}`}
                        profilePath={cast.profile_path}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {(activeTab === "all" || activeTab === "crew") &&
            filteredCrew.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold">Crew ({filteredCrew.length})</h2>
                <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCrew.map((crew, index) => (
                    <li key={crew.id ? `crew-${crew.id}-${index}` : index}>
                      <CastMemberCard
                        name={crew.name}
                        role={crew.job || crew.known_for_department}
                        subtitle={`Department: ${crew.department || crew.known_for_department}`}
                        profilePath={crew.profile_path}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {searchFilter &&
            filteredCast.length === 0 &&
            filteredCrew.length === 0 && (
              <div className="flex h-50 w-full items-center justify-center rounded-lg border bg-card p-8">
                <p className="text-muted-foreground">
                  No cast or crew matching &quot;{searchFilter}&quot;
                </p>
              </div>
            )}
        </div>
      )}
    </main>
  );
}
