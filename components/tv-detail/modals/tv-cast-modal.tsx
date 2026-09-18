"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Search, User } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TVShowDetailsData, Cast, Crew } from "@/types";
import { cn } from "@/lib/utils";

export interface TVCastModalProps {
  isOpen: boolean;
  onClose: () => void;
  show: TVShowDetailsData;
  cast: Cast[];
  crew: Crew[];
}

export function TVCastModal({
  isOpen,
  onClose,
  show,
  cast,
  crew,
}: TVCastModalProps) {
  const airYear = show.first_air_date
    ? show.first_air_date.substring(0, 4)
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
        className="inset-x-0 bottom-0 mx-auto h-[90vh] max-h-[92vh] w-full max-w-(--max-container) overflow-hidden rounded-none border-x border-t border-b-0 border-border/80 bg-background/95 p-0 shadow-2xl backdrop-blur-2xl"
      >
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {/* Header bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-border/70 px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="shrink-0 rounded-none hover:bg-muted"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground sm:text-xl">
                  {show.name}{" "}
                  {airYear && (
                    <span className="font-normal text-muted-foreground">
                      ({airYear})
                    </span>
                  )}
                </SheetTitle>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:text-sm">
                  Full Cast &amp; Crew
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
                onClick={() => setCastTab("all")}
                className="flex-1 rounded-none text-xs"
              >
                All ({cast.length + crew.length})
              </Button>
              <Button
                variant={castTab === "cast" ? "default" : "secondary"}
                size="sm"
                onClick={() => setCastTab("cast")}
                className="flex-1 rounded-none text-xs"
              >
                Cast ({cast.length})
              </Button>
              <Button
                variant={castTab === "crew" ? "default" : "secondary"}
                size="sm"
                onClick={() => setCastTab("crew")}
                className="flex-1 rounded-none text-xs"
              >
                Crew ({crew.length})
              </Button>
            </div>

            {castTab !== "cast" && allDepartments.length > 0 && (
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="h-8 w-full rounded-none text-xs">
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
            )}
          </div>

          {/* Main 2-column Desktop layout */}
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {/* Desktop Left Sidebar Navigation */}
            <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-border/70 bg-muted/20 p-4 md:block">
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Categories
                  </h4>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setCastTab("all");
                        setSelectedDept("all");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                        castTab === "all" && selectedDept === "all"
                          ? "bg-primary font-bold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>All Personnel</span>
                      <Badge variant="secondary" className="rounded-none text-[10px]">
                        {cast.length + crew.length}
                      </Badge>
                    </button>

                    <button
                      onClick={() => {
                        setCastTab("cast");
                        setSelectedDept("all");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                        castTab === "cast"
                          ? "bg-primary font-bold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>Cast Members</span>
                      <Badge variant="secondary" className="rounded-none text-[10px]">
                        {cast.length}
                      </Badge>
                    </button>

                    <button
                      onClick={() => {
                        setCastTab("crew");
                        setSelectedDept("all");
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
                        castTab === "crew" && selectedDept === "all"
                          ? "bg-primary font-bold text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <span>All Crew</span>
                      <Badge variant="secondary" className="rounded-none text-[10px]">
                        {crew.length}
                      </Badge>
                    </button>
                  </div>
                </div>

                {/* Departments list */}
                {allDepartments.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      Departments
                    </h4>
                    <div className="space-y-0.5">
                      {allDepartments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setCastTab("crew");
                            setSelectedDept(dept);
                          }}
                          className={cn(
                            "flex w-full items-center justify-between rounded-none px-3 py-1.5 text-left text-xs font-medium transition-colors",
                            castTab === "crew" && selectedDept === dept
                              ? "bg-primary font-bold text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <span className="truncate">{dept}</span>
                          <span className="text-[10px] opacity-70">
                            {deptCounts[dept]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="space-y-8">
                {/* Cast Section */}
                {castTab !== "crew" && filteredCast.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-base font-bold text-foreground sm:text-lg">
                      Cast ({filteredCast.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {filteredCast.map((c) => {
                        const profileUrl = c.profile_path
                          ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                          : null;
                        return (
                          <Link
                            key={`${c.id}-${c.character}`}
                            href={`/person/${c.id}`}
                            className="group flex flex-col overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md"
                          >
                            <div className="relative aspect-4/5 w-full bg-muted">
                              {profileUrl ? (
                                <Image
                                  src={profileUrl}
                                  alt={c.name}
                                  fill
                                  sizes="160px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex size-full items-center justify-center text-muted-foreground">
                                  <User className="size-8" />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h5 className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-primary sm:text-sm">
                                {c.name}
                              </h5>
                              <p className="line-clamp-1 text-[11px] text-muted-foreground">
                                {c.character || "Cast"}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Crew Sections grouped by department */}
                {castTab !== "cast" && Object.keys(crewByDepartment).length > 0 && (
                  <div className="space-y-6">
                    {Object.entries(crewByDepartment).map(([dept, members]) => (
                      <div key={dept}>
                        <h3 className="mb-3 text-sm font-bold text-foreground sm:text-base">
                          {dept} ({members.length})
                        </h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {members.map((m, idx) => {
                            const profileUrl = m.profile_path
                              ? `https://image.tmdb.org/t/p/w185${m.profile_path}`
                              : null;
                            return (
                              <Link
                                key={`${m.id}-${m.job}-${idx}`}
                                href={`/person/${m.id}`}
                                className="group flex flex-col overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md"
                              >
                                <div className="relative aspect-4/5 w-full bg-muted">
                                  {profileUrl ? (
                                    <Image
                                      src={profileUrl}
                                      alt={m.name}
                                      fill
                                      sizes="160px"
                                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="flex size-full items-center justify-center text-muted-foreground">
                                      <User className="size-8" />
                                    </div>
                                  )}
                                </div>
                                <div className="p-3">
                                  <h5 className="line-clamp-1 text-xs font-bold text-foreground group-hover:text-primary sm:text-sm">
                                    {m.name}
                                  </h5>
                                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                                    {m.job || dept}
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

                {filteredCast.length === 0 && Object.keys(crewByDepartment).length === 0 && (
                  <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                    No results found for &quot;{castSearch}&quot;.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default TVCastModal;
