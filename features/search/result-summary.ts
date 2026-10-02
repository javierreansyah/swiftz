export interface SearchSummaryItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  known_for_department?: string;
}

export function searchResultSummary(
  item: SearchSummaryItem,
  type: "movie" | "tv" | "person",
) {
  const date = item.release_date || item.first_air_date;
  return {
    title: item.title || item.name || "Untitled",
    imagePath: item.poster_path || item.profile_path,
    href: `/${type}/${item.id}`,
    subtitle:
      type === "person"
        ? item.known_for_department || "Celebrity"
        : date?.slice(0, 4) || "",
  };
}
