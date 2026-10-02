import {
  DEFAULT_TV_FILTERS,
  TV_GENRES,
  TV_SORT_OPTIONS,
  type TVFilterState,
} from "@/features/tv/discovery/types";
import {
  finiteRange,
  optionValue,
  positiveId,
  type SearchParamsReader,
} from "@/lib/filter-values";
import type { DiscoverTVFilters } from "@/lib/tmdb/types/tv";
export function parseTVFilters(
  params: SearchParamsReader,
  defaults = DEFAULT_TV_FILTERS,
): TVFilterState {
  const year = params.get("year") || "";
  return {
    sort_by: optionValue(
      params.get("sort_by"),
      TV_SORT_OPTIONS.map((o) => o.value),
      defaults.sort_by,
    ),
    with_genres: [
      ...new Set(
        (params.get("genres") || "")
          .split(",")
          .filter((id) => positiveId(id) && TV_GENRES.some((g) => g.id === id)),
      ),
    ],
    first_air_date_year: /^\d{4}$/.test(year) && Number(year) > 0 ? year : "",
    vote_average_gte: finiteRange(params.get("rating"), 0, 0, 10),
  };
}

export function serializeTVFilters(
  filters: TVFilterState,
  page = 1,
  defaults = DEFAULT_TV_FILTERS,
) {
  const params = new URLSearchParams();
  if (filters.sort_by !== defaults.sort_by)
    params.set("sort_by", filters.sort_by);
  if (filters.with_genres.length)
    params.set("genres", filters.with_genres.join(","));
  if (filters.first_air_date_year)
    params.set("year", filters.first_air_date_year);
  if (filters.vote_average_gte > 0)
    params.set("rating", String(filters.vote_average_gte));
  if (page > 1) params.set("page", String(page));
  return params.toString();
}

export function hasTVFilters(
  filters: TVFilterState,
  defaults = DEFAULT_TV_FILTERS,
) {
  return (
    filters.sort_by !== defaults.sort_by ||
    filters.with_genres.length > 0 ||
    Boolean(filters.first_air_date_year) ||
    filters.vote_average_gte > 0
  );
}

export function buildTVFilters(
  filters: TVFilterState,
  page = 1,
): DiscoverTVFilters {
  return {
    page,
    sort_by: filters.sort_by,
    with_genres: filters.with_genres.length
      ? filters.with_genres.join(",")
      : undefined,
    first_air_date_year: filters.first_air_date_year
      ? Number(filters.first_air_date_year)
      : undefined,
    "vote_average.gte":
      filters.vote_average_gte > 0 ? filters.vote_average_gte : undefined,
  };
}
