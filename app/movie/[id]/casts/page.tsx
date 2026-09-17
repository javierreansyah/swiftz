"use client";

import React, { use, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, ArrowLeft, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMovieCastQuery } from "@/hooks/use-tmdb";

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
        c.known_for_department?.toLowerCase().includes(term) ||
        c.job?.toLowerCase().includes(term)
    );
  }, [crewList, searchFilter]);

  return (
    <main className="container space-y-6 pt-20 pb-12">
      <div className="flex flex-col justify-between gap-4 pt-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/movie/${id}`}>
              <ArrowLeft className="size-5" />
              <span className="sr-only">Back to movie</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Cast & Crew
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter by name..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("all")}
        >
          All ({castList.length + crewList.length})
        </Button>
        <Button
          variant={activeTab === "cast" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("cast")}
        >
          Cast ({castList.length})
        </Button>
        <Button
          variant={activeTab === "crew" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("crew")}
        >
          Crew ({crewList.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex h-37.5 animate-pulse rounded-md border bg-card"
            >
              <div className="h-full w-25 bg-secondary" />
              <div className="flex-1 space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : isError || (!castList.length && !crewList.length) ? (
        <div className="flex h-62.5 w-full items-center justify-center rounded-lg border bg-card p-8">
          <h2 className="text-xl font-medium">No cast or crew information found.</h2>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === "all" || activeTab === "cast") && filteredCast.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Cast ({filteredCast.length})</h2>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCast.map((cast, index) => {
                  const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
                  return (
                    <li key={cast.id ? `cast-${cast.id}-${index}` : index}>
                      <div className="flex overflow-clip rounded-md border bg-card transition-colors hover:border-primary/50">
                        {cast.profile_path ? (
                          <div className="relative aspect-2/3 h-35 flex-none sm:h-40">
                            <Image
                              src={castProfileUrl}
                              alt={cast.name}
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
                            <h3 className="truncate text-base font-bold">{cast.name}</h3>
                            <p className="truncate text-sm font-light text-muted-foreground">
                              {cast.character || "Unknown Character"}
                            </p>
                          </div>
                          <p className="text-xs font-light text-muted-foreground">
                            Popularity: {Number(cast.popularity).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {(activeTab === "all" || activeTab === "crew") && filteredCrew.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">Crew ({filteredCrew.length})</h2>
              <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCrew.map((crew, index) => {
                  const crewProfileUrl = `https://image.tmdb.org/t/p/w185${crew.profile_path}`;
                  return (
                    <li key={crew.id ? `crew-${crew.id}-${index}` : index}>
                      <div className="flex overflow-clip rounded-md border bg-card transition-colors hover:border-primary/50">
                        {crew.profile_path ? (
                          <div className="relative aspect-2/3 h-35 flex-none sm:h-40">
                            <Image
                              src={crewProfileUrl}
                              alt={crew.name}
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
                            <h3 className="truncate text-base font-bold">{crew.name}</h3>
                            <p className="truncate text-sm font-light text-muted-foreground">
                              {crew.job || crew.known_for_department}
                            </p>
                          </div>
                          <p className="text-xs font-light text-muted-foreground">
                            Department: {crew.department || crew.known_for_department}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {searchFilter && filteredCast.length === 0 && filteredCrew.length === 0 && (
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
