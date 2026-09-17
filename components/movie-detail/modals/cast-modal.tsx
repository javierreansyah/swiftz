"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { X, Search, User, Users, Film, Briefcase } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MovieDetailsData, Cast, Crew } from "@/types";
import { cn } from "@/lib/utils";

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
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [castSearch, setCastSearch] = useState("");

  const allDepartments = useMemo(() => {
    const depts = new Set<string>();
    crew.forEach((c) => {
      if (c.department) depts.add(c.department);
    });
    return Array.from(depts).sort();
  }, [crew]);

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    crew.forEach((c) => {
      const d = c.department || "Other";
      counts[d] = (counts[d] || 0) + 1;
    });
    return counts;
  }, [crew]);

  const filteredCast = useMemo(() => {
    if (castTab === "crew") return [];
    if (!castSearch.trim()) return cast;
    const q = castSearch.toLowerCase();
    return cast.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.character?.toLowerCase().includes(q)
    );
  }, [cast, castSearch, castTab]);

  const filteredCrew = useMemo(() => {
    if (castTab === "cast") return [];
    let list = crew;
    if (selectedDept !== "all") {
      list = list.filter((c) => (c.department || "Other") === selectedDept);
    }
    if (!castSearch.trim()) return list;
    const q = castSearch.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.job?.toLowerCase().includes(q) ||
        c.department?.toLowerCase().includes(q)
    );
  }, [crew, castSearch, castTab, selectedDept]);

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
        showCloseButton={false}
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-t-3xl border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-full hover:bg-muted"
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
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-sm">
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

          {/* Mobile Top Controls */}
          <div className="flex flex-col gap-2 border-b border-border/60 bg-muted/20 p-3 md:hidden">
            <div className="flex gap-2">
              <Button
                variant={castTab === "all" ? "default" : "secondary"}
                size="sm"
                onClick={() => {
                  setCastTab("all");
                  setSelectedDept("all");
                }}
                className="h-7 rounded-full text-xs"
              >
                All ({cast.length + crew.length})
              </Button>
              <Button
                variant={castTab === "cast" ? "default" : "secondary"}
                size="sm"
                onClick={() => setCastTab("cast")}
                className="h-7 rounded-full text-xs"
              >
                Cast ({cast.length})
              </Button>
              <Button
                variant={castTab === "crew" ? "default" : "secondary"}
                size="sm"
                onClick={() => setCastTab("crew")}
                className="h-7 rounded-full text-xs"
              >
                Crew ({crew.length})
              </Button>
            </div>
            {castTab !== "cast" && allDepartments.length > 0 && (
              <div className="pt-1">
                <Select
                  value={selectedDept}
                  onValueChange={(val) => setSelectedDept(val)}
                >
                  <SelectTrigger className="h-8 w-full bg-card text-xs">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Departments ({crew.length})
                    </SelectItem>
                    {allDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept} ({deptCounts[dept] || 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Body with Desktop Sidebar + Main Content */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Desktop Left Sidebar */}
            <aside className="hidden w-60 shrink-0 flex-col gap-4 overflow-y-auto border-r border-border/70 bg-muted/15 p-4 md:flex">
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Category
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCastTab("all");
                      setSelectedDept("all");
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                      castTab === "all" && selectedDept === "all"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="size-4" />
                      All Members
                    </span>
                    <span className="text-[10px] opacity-80">
                      {cast.length + crew.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCastTab("cast");
                      setSelectedDept("all");
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                      castTab === "cast"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Film className="size-4" />
                      Cast
                    </span>
                    <span className="text-[10px] opacity-80">{cast.length}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCastTab("crew");
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                      castTab === "crew" && selectedDept === "all"
                        ? "bg-primary font-semibold text-primary-foreground"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <Briefcase className="size-4" />
                      All Crew
                    </span>
                    <span className="text-[10px] opacity-80">{crew.length}</span>
                  </button>
                </div>
              </div>

              {/* Departments Sub-filters */}
              <div>
                <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Crew Departments
                </h4>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCastTab("crew");
                      setSelectedDept("all");
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors",
                      castTab === "crew" && selectedDept === "all"
                        ? "bg-accent font-semibold text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <span>All Departments</span>
                    <span className="text-[10px]">{crew.length}</span>
                  </button>
                  {allDepartments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        setCastTab("crew");
                        setSelectedDept(dept);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs transition-colors",
                        castTab === "crew" && selectedDept === dept
                          ? "bg-primary font-semibold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span className="truncate">{dept}</span>
                      <span className="ml-2 text-[10px] opacity-80">
                        {deptCounts[dept] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <ScrollArea className="min-h-0 flex-1 p-6 sm:p-8">
              {/* Cast Grid */}
              {filteredCast.length > 0 && (
                <div className="space-y-4 pb-8">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    Cast ({filteredCast.length})
                  </h3>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                    {filteredCast.map((c) => {
                      const profileUrl = c.profile_path
                        ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                        : null;
                      return (
                        <div
                          key={c.id + (c.character || "")}
                          className="group overflow-hidden rounded-xl border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md"
                        >
                          <div className="relative aspect-4/5 w-full overflow-hidden bg-muted">
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
                          <div className="p-2.5">
                            <h4 className="truncate text-xs font-bold text-foreground sm:text-sm">
                              {c.name}
                            </h4>
                            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                              {c.character}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Crew Groups */}
              {filteredCrew.length > 0 && (
                <div className="space-y-6">
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {selectedDept !== "all"
                      ? `${selectedDept} (${filteredCrew.length})`
                      : `Crew by Department (${filteredCrew.length})`}
                  </h3>
                  {Object.entries(crewByDepartment).map(([dept, members]) => (
                    <div
                      key={dept}
                      className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-5"
                    >
                      <h4 className="text-sm font-bold text-primary sm:text-base">
                        {dept} ({members.length})
                      </h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((m, idx) => (
                          <div
                            key={m.credit_id || idx}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border/40 bg-card p-2.5 text-xs"
                          >
                            <span className="truncate font-semibold text-foreground">
                              {m.name}
                            </span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {m.job || dept}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {filteredCast.length === 0 && filteredCrew.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-base font-medium text-foreground">
                    No cast or crew found
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default CastModal;
