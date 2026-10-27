import type { PersonCombinedCredits } from "@/lib/tmdb/types/people";

export interface UnifiedCreditItem {
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

/** Normalize and sort once; filtering keeps this order and never mutates API data. */
export function prepareCredits(credits: PersonCombinedCredits) {
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

  const departments = Array.from(
    new Set(list.map((credit) => credit.department)),
  );
  list.sort((a, b) => {
    if (b.releaseYearSortKey !== a.releaseYearSortKey) {
      return b.releaseYearSortKey - a.releaseYearSortKey;
    }
    return b.rawDate.localeCompare(a.rawDate);
  });
  return { items: list, departments };
}

export function filterCredits(
  credits: UnifiedCreditItem[],
  department: string,
  mediaType: "all" | "movie" | "tv",
  searchQuery: string,
) {
  const selectedDepartment = department.toLowerCase();
  const query = searchQuery.trim() ? searchQuery.toLowerCase() : "";
  return credits.filter(
    (credit) =>
      (!department ||
        department === "all" ||
        credit.department.toLowerCase() === selectedDepartment) &&
      (mediaType === "all" || credit.mediaType === mediaType) &&
      (!query ||
        credit.title.toLowerCase().includes(query) ||
        credit.characterOrJob.toLowerCase().includes(query)),
  );
}
