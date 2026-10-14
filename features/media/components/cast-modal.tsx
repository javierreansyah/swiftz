"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/features/media/components/filter-sidebar-primitives";
import { PersonnelGrid } from "@/features/media/components/personnel-grid";
import type { Cast, Crew } from "@/lib/tmdb/types/common";
import { DetailBottomSheet } from "@/features/media/components/detail-bottom-sheet";
import { usePersonDetailsQuery } from "@/features/people/hooks/queries";
import { PersonDetailContent } from "@/features/people/components/person-detail-content";
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
  initialPersonId?: number | null;
}

export function CastModal({
  isOpen,
  onClose,
  movie,
  title: customTitle,
  releaseYear: customReleaseYear,
  cast,
  crew,
  initialPersonId = null,
}: CastModalProps) {
  const displayTitle =
    customTitle || movie?.title || movie?.name || "Cast & Crew";
  const rawDate = movie?.release_date || movie?.first_air_date;
  const displayYear =
    customReleaseYear || (rawDate ? rawDate.substring(0, 4) : "");

  const [castTab, setCastTab] = useState<"all" | "cast" | "crew">("all");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [castSearch, setCastSearch] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

  // Sync the person view when the sheet opens (e.g. opened directly on a
  // person from Top Cast, or on the grid from See all).
  useEffect(() => {
    if (!isOpen) return;
    setSelectedPersonId(initialPersonId ?? null);
  }, [isOpen, initialPersonId]);

  const showPerson = selectedPersonId !== null;
  const personQuery = usePersonDetailsQuery(
    selectedPersonId ?? 0,
    isOpen && showPerson,
  );
  const selectedPerson = personQuery.data ?? null;

  const handleClose = () => {
    setSelectedPersonId(null);
    onClose();
  };

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

  const backButton = (
    <Button
      variant="secondary"
      size="icon-sm"
      type="button"
      onClick={() => setSelectedPersonId(null)}
      aria-label="Back to cast"
    >
      <ChevronLeft className="size-4" />
    </Button>
  );

  const personHeaderActions = showPerson ? (
    <div className="flex items-center gap-2">
      {backButton}
      <Button asChild variant="secondary" size="sm">
        <Link
          href={`/person/${selectedPersonId}`}
          prefetch={false}
          onClick={handleClose}
        >
          <ExternalLink className="size-3.5" />
          <span>Full Profile</span>
        </Link>
      </Button>
    </div>
  ) : undefined;

  const personMobileControls = showPerson ? (
    <div className="flex items-center gap-2">
      {backButton}
      <Button asChild variant="secondary" size="sm" className="flex-1">
        <Link
          href={`/person/${selectedPersonId}`}
          prefetch={false}
          onClick={handleClose}
        >
          <ExternalLink className="size-3.5" />
          <span>Full Profile</span>
        </Link>
      </Button>
    </div>
  ) : undefined;

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
          <div className="flex flex-col gap-1">
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
    <div
      className={cn(
        "grid gap-2",
        castTab !== "cast" && allDepartments.length > 0
          ? "grid-cols-2"
          : "grid-cols-1",
      )}
    >
      <FilterSelect
        value={castTab}
        onChange={(val) => {
          const tab = val as "all" | "cast" | "crew";
          setCastTab(tab);
          if (tab === "cast") {
            setSelectedDept("all");
          }
        }}
        placeholder="Category"
        ariaLabel="Filter category"
        options={[
          { value: "all", label: `All (${totalPersonnel})` },
          { value: "cast", label: `Cast (${cast.length})` },
          { value: "crew", label: `Crew (${crew.length})` },
        ]}
      />

      {castTab !== "cast" && allDepartments.length > 0 && (
        <FilterSelect
          value={selectedDept}
          onChange={setSelectedDept}
          placeholder="All Departments"
          ariaLabel="Filter by department"
          options={[
            { value: "all", label: `All Depts (${crew.length})` },
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
      onClose={handleClose}
      title={showPerson ? (selectedPerson?.name ?? "Person") : displayTitle}
      subtitle={
        showPerson
          ? selectedPerson?.known_for_department
          : displayYear
            ? `Full Cast & Crew · ${displayYear}`
            : "Full Cast & Crew"
      }
      search={
        showPerson
          ? undefined
          : {
              value: castSearch,
              onChange: setCastSearch,
              placeholder: "Search cast or crew...",
            }
      }
      headerActions={personHeaderActions}
      sidebar={showPerson ? undefined : desktopSidebar}
      mobileControls={showPerson ? personMobileControls : mobileControls}
    >
      {showPerson ? (
        <PersonDetailContent
          personId={selectedPersonId}
          enabled={isOpen}
          onNavigate={handleClose}
        />
      ) : (
        <div className="space-y-8">
          <PersonnelGrid
            title="Cast"
            people={filteredCast}
            onSelectPerson={setSelectedPersonId}
          />
          <PersonnelGrid
            title="Crew"
            people={filteredCrew}
            onSelectPerson={setSelectedPersonId}
          />

          {filteredCast.length === 0 && filteredCrew.length === 0 && (
            <div className="py-20 text-center text-muted-foreground">
              No personnel found matching &ldquo;{castSearch}&rdquo;.
            </div>
          )}
        </div>
      )}
    </DetailBottomSheet>
  );
}
