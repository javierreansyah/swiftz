"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/features/media/components/filter-sidebar-primitives";
import { PersonnelGrid } from "@/features/media/components/personnel-grid";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { DetailBottomSheet } from "@/features/media/components/detail-bottom-sheet";
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
          (c.character && c.character.toLowerCase().includes(q)),
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
          (c.job && c.job.toLowerCase().includes(q)),
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
          <Button
            variant={
              castTab === "all" && selectedDept === "all" ? "default" : "ghost"
            }
            size="sm"
            type="button"
            onClick={() => {
              setCastTab("all");
              setSelectedDept("all");
            }}
            className="justify-between"
          >
            <span>All Personnel</span>
            <span className="text-xs opacity-80">{totalPersonnel}</span>
          </Button>
          <Button
            variant={castTab === "cast" ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => {
              setCastTab("cast");
              setSelectedDept("all");
            }}
            className="justify-between"
          >
            <span>Cast Members</span>
            <span className="text-xs opacity-80">{cast.length}</span>
          </Button>
          <Button
            variant={castTab === "crew" ? "default" : "ghost"}
            size="sm"
            type="button"
            onClick={() => setCastTab("crew")}
            className="justify-between"
          >
            <span>Crew Members</span>
            <span className="text-xs opacity-80">{crew.length}</span>
          </Button>
        </div>
      </div>

      {castTab !== "cast" && allDepartments.length > 0 && (
        <div>
          <h4 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Departments
          </h4>
          <div className="flex max-h-60 flex-col gap-1 overflow-y-auto pr-1">
            <Button
              variant={selectedDept === "all" ? "default" : "ghost"}
              size="sm"
              type="button"
              onClick={() => setSelectedDept("all")}
              className="justify-between"
            >
              <span>All Departments</span>
              <span className="text-xs opacity-80">{crew.length}</span>
            </Button>
            {allDepartments.map((dept) => (
              <Button
                variant={selectedDept === dept ? "default" : "ghost"}
                size="sm"
                key={dept}
                type="button"
                onClick={() => setSelectedDept(dept)}
                className="justify-between"
              >
                <span className="truncate">{dept}</span>
                <span className="text-xs opacity-80">{deptCounts[dept]}</span>
              </Button>
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
        >
          Cast ({cast.length})
        </Button>
        <Button
          variant={castTab === "crew" ? "default" : "secondary"}
          size="sm"
          onClick={() => setCastTab("crew")}
        >
          Crew ({crew.length})
        </Button>
      </div>

      {castTab !== "cast" && allDepartments.length > 0 && (
        <FilterSelect
          value={selectedDept}
          onChange={setSelectedDept}
          placeholder="All Departments"
          options={[
            { value: "all", label: `All Departments (${crew.length})` },
            ...allDepartments.map((dept) => ({
              value: dept,
              label: `${dept} (${deptCounts[dept] || 0})`,
            })),
          ]}
        />
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
        <PersonnelGrid
          title="Cast"
          people={filteredCast}
          onNavigate={onClose}
        />
        <PersonnelGrid
          title="Crew"
          people={filteredCrew}
          onNavigate={onClose}
        />

        {filteredCast.length === 0 && filteredCrew.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            No personnel found matching &ldquo;{castSearch}&rdquo;.
          </div>
        )}
      </div>
    </DetailBottomSheet>
  );
}
