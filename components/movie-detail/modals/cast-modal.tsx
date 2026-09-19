"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cast, Crew } from "@/types";
import { DetailBottomSheet } from "@/components/common/detail-bottom-sheet";
import { cn } from "@/lib/utils";

export interface CastModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie?: {
    id?: number;
    title?: string;
    name?: string;
    release_date?: string;
    first_air_date?: string;
  };
  title?: string;
  releaseYear?: string;
  cast: Cast[];
  crew: Crew[];
}

export function CastModal({
  isOpen,
  onClose,
  movie,
  title: customTitle,
  releaseYear: customReleaseYear,
  cast,
  crew,
}: CastModalProps) {
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Cast & Crew";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

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
    let list = [...cast];
    if (castSearch.trim()) {
      const q = castSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.character && c.character.toLowerCase().includes(q))
      );
    }
    return list;
  }, [cast, castTab, castSearch]);

  const filteredCrew = useMemo(() => {
    if (castTab === "cast") return [];
    let list = [...crew];
    if (selectedDept !== "all") {
      list = list.filter((c) => c.department === selectedDept);
    }
    if (castSearch.trim()) {
      const q = castSearch.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.job && c.job.toLowerCase().includes(q))
      );
    }
    return list;
  }, [crew, castTab, selectedDept, castSearch]);

  const totalPersonnel = cast.length + crew.length;

  const desktopSidebar = (
    <div className="flex flex-col gap-4">
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
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              castTab === "all" && selectedDept === "all"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>All Personnel</span>
            <span className="text-[11px] opacity-80">{totalPersonnel}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setCastTab("cast");
              setSelectedDept("all");
            }}
            className={cn(
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              castTab === "cast"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>Cast Members</span>
            <span className="text-[11px] opacity-80">{cast.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setCastTab("crew")}
            className={cn(
              "flex items-center justify-between rounded-none px-3 py-2 text-left text-xs font-medium transition-colors",
              castTab === "crew"
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-foreground/80 hover:bg-muted"
            )}
          >
            <span>Crew Members</span>
            <span className="text-[11px] opacity-80">{crew.length}</span>
          </button>
        </div>
      </div>

      {castTab !== "cast" && allDepartments.length > 0 && (
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Departments
          </h4>
          <div className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => setSelectedDept("all")}
              className={cn(
                "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs font-medium transition-colors",
                selectedDept === "all"
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-foreground/80 hover:bg-muted"
              )}
            >
              <span>All Departments</span>
              <span className="text-[11px] opacity-80">{crew.length}</span>
            </button>
            {allDepartments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  "flex items-center justify-between rounded-none px-3 py-1.5 text-left text-xs font-medium transition-colors",
                  selectedDept === dept
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "text-foreground/80 hover:bg-muted"
                )}
              >
                <span className="truncate">{dept}</span>
                <span className="text-[11px] opacity-80">
                  {deptCounts[dept]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const mobileControls = (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant={castTab === "all" ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            setCastTab("all");
            setSelectedDept("all");
          }}
          className="h-7 rounded-none text-xs"
        >
          All ({totalPersonnel})
        </Button>
        <Button
          variant={castTab === "cast" ? "default" : "secondary"}
          size="sm"
          onClick={() => {
            setCastTab("cast");
            setSelectedDept("all");
          }}
          className="h-7 rounded-none text-xs"
        >
          Cast ({cast.length})
        </Button>
        <Button
          variant={castTab === "crew" ? "default" : "secondary"}
          size="sm"
          onClick={() => setCastTab("crew")}
          className="h-7 rounded-none text-xs"
        >
          Crew ({crew.length})
        </Button>
      </div>

      {castTab !== "cast" && allDepartments.length > 0 && (
        <Select
          value={selectedDept}
          onValueChange={(val) => setSelectedDept(val)}
        >
          <SelectTrigger className="h-8 w-full rounded-none bg-card text-xs">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments ({crew.length})</SelectItem>
            {allDepartments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept} ({deptCounts[dept] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );

  return (
    <DetailBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={displayTitle}
      subtitle={
        displayYear ? `Full Cast & Crew · ${displayYear}` : "Full Cast & Crew"
      }
      badge={`${totalPersonnel} Personnel`}
      search={{
        value: castSearch,
        onChange: setCastSearch,
        placeholder: "Search cast or crew...",
      }}
      sidebar={desktopSidebar}
      mobileControls={mobileControls}
    >
      <div className="space-y-8">
        {/* Cast Section */}
        {filteredCast.length > 0 && (
          <div className="space-y-4">
            <h3 className="border-b border-border/50 pb-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Cast ({filteredCast.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredCast.map((c) => {
                const profileUrl = c.profile_path
                  ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                  : null;

                return (
                  <Link
                    key={c.id + (c.character || "")}
                    href={`/person/${c.id}`}
                    onClick={onClose}
                    className="group flex flex-col overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-4/5 w-full bg-muted">
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={c.name}
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-secondary">
                          <User className="size-8 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {c.name}
                      </h4>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {c.character || "Actor"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Crew Section */}
        {filteredCrew.length > 0 && (
          <div className="space-y-4">
            <h3 className="border-b border-border/50 pb-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
              Crew ({filteredCrew.length})
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filteredCrew.map((c, i) => {
                const profileUrl = c.profile_path
                  ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                  : null;

                return (
                  <Link
                    key={`${c.id}-${c.job}-${i}`}
                    href={`/person/${c.id}`}
                    onClick={onClose}
                    className="group flex flex-col overflow-hidden rounded-none border border-border/70 bg-card/60 transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-4/5 w-full bg-muted">
                      {profileUrl ? (
                        <Image
                          src={profileUrl}
                          alt={c.name}
                          fill
                          sizes="180px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center bg-secondary">
                          <User className="size-8 text-muted-foreground/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                        {c.name}
                      </h4>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {c.job || c.department}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {filteredCast.length === 0 && filteredCrew.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No personnel found matching &ldquo;{castSearch}&rdquo;.
          </div>
        )}
      </div>
    </DetailBottomSheet>
  );
}

export default CastModal;
