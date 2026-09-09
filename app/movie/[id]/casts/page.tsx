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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/movie/${id}`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to movie</span>
            </Link>
          </Button>
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl">
            Cast & Crew
          </h1>
        </div>

        <div className="relative w-full sm:w-72">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="flex bg-card rounded-md border h-[150px] animate-pulse"
            >
              <div className="w-[100px] h-full bg-secondary" />
              <div className="p-4 space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-secondary rounded" />
                <div className="h-3 w-1/2 bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : isError || (!castList.length && !crewList.length) ? (
        <div className="h-[250px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
          <h2 className="text-xl font-medium">No cast or crew information found.</h2>
        </div>
      ) : (
        <div className="space-y-8">
          {(activeTab === "all" || activeTab === "cast") && filteredCast.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-bold text-2xl">Cast ({filteredCast.length})</h2>
              <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCast.map((cast, index) => {
                  const castProfileUrl = `https://image.tmdb.org/t/p/w185${cast.profile_path}`;
                  return (
                    <li key={cast.id ? `cast-${cast.id}-${index}` : index}>
                      <div className="flex bg-card rounded-md overflow-clip border hover:border-primary/50 transition-colors">
                        {cast.profile_path ? (
                          <div className="relative aspect-[2/3] h-[140px] sm:h-[160px] flex-none">
                            <Image
                              src={castProfileUrl}
                              alt={cast.name}
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-[2/3] h-[140px] sm:h-[160px] flex-none bg-secondary flex items-center justify-center">
                            <User size={40} className="text-muted-foreground" />
                          </div>
                        )}

                        <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <h3 className="font-bold text-base truncate">{cast.name}</h3>
                            <p className="font-light text-sm text-muted-foreground truncate">
                              {cast.character || "Unknown Character"}
                            </p>
                          </div>
                          <p className="font-light text-xs text-muted-foreground">
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
              <h2 className="font-bold text-2xl">Crew ({filteredCrew.length})</h2>
              <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCrew.map((crew, index) => {
                  const crewProfileUrl = `https://image.tmdb.org/t/p/w185${crew.profile_path}`;
                  return (
                    <li key={crew.id ? `crew-${crew.id}-${index}` : index}>
                      <div className="flex bg-card rounded-md overflow-clip border hover:border-primary/50 transition-colors">
                        {crew.profile_path ? (
                          <div className="relative aspect-[2/3] h-[140px] sm:h-[160px] flex-none">
                            <Image
                              src={crewProfileUrl}
                              alt={crew.name}
                              fill
                              sizes="120px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="relative aspect-[2/3] h-[140px] sm:h-[160px] flex-none bg-secondary flex items-center justify-center">
                            <User size={40} className="text-muted-foreground" />
                          </div>
                        )}

                        <div className="p-4 flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <h3 className="font-bold text-base truncate">{crew.name}</h3>
                            <p className="font-light text-sm text-muted-foreground truncate">
                              {crew.job || crew.known_for_department}
                            </p>
                          </div>
                          <p className="font-light text-xs text-muted-foreground">
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
            <div className="h-[200px] rounded-lg w-full border flex items-center justify-center bg-card p-8">
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
