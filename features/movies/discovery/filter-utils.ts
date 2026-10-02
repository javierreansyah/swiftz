import {
  finiteRange,
  positiveId,
  optionValue,
  isoDate,
  decodeFilterLabel,
  type SearchParamsReader,
} from "@/lib/filter-values";
import type { DiscoverMovieFilters } from "@/lib/tmdb/types/movie";
import {
  type DiscoverFilterState,
  DEFAULT_DISCOVER_FILTERS,
  SORT_OPTIONS,
  CERTIFICATION_OPTIONS,
  LANGUAGE_OPTIONS,
  WATCH_REGION_OPTIONS,
} from "@/features/movies/discovery/types";
import { movieGenres } from "@/features/movies/genres/genres";
export function parseFiltersFromParams(
  searchParams: SearchParamsReader,
  defaults: DiscoverFilterState = DEFAULT_DISCOVER_FILTERS,
): DiscoverFilterState {
  const sortBy = optionValue(
    searchParams.get("sort_by"),
    SORT_OPTIONS.map((o) => o.value),
    defaults.sort_by,
  );
  const genresParam = searchParams.get("with_genres");
  const withGenres = genresParam
    ? [
        ...new Set(
          genresParam
            .split(",")
            .filter(
              (id) =>
                positiveId(id) &&
                movieGenres.some((genre) => String(genre.id) === id),
            ),
        ),
      ]
    : [];

  const keywordsParam = searchParams.get("with_keywords");
  const keywordsNamesParam = searchParams.get("keywords_names");
  const keywordIds = keywordsParam
    ? keywordsParam.split(",").filter(Boolean)
    : [];
  const keywordNames = keywordsNamesParam
    ? keywordsNamesParam.split(",").filter(Boolean)
    : [];

  const keywords = keywordIds.flatMap((id, index) =>
    positiveId(id)
      ? [{ id: Number(id), name: decodeFilterLabel(keywordNames[index] || id) }]
      : [],
  );

  const releaseDatePreset = optionValue(
    searchParams.get("release_preset"),
    ["all", "2026", "2025", "2020-2024", "2010s", "classic"],
    "all",
  );
  const releaseDateGte = isoDate(searchParams.get("release_date_gte"));
  const releaseDateLte = isoDate(searchParams.get("release_date_lte"));

  const certification = optionValue(
    searchParams.get("certification"),
    CERTIFICATION_OPTIONS,
    "all",
  );
  const originalLanguage = optionValue(
    searchParams.get("language"),
    LANGUAGE_OPTIONS.map((o) => o.value),
    "all",
  );

  const voteAverageGte = finiteRange(searchParams.get("score_gte"), 0, 0, 10);
  const voteAverageLte = finiteRange(searchParams.get("score_lte"), 10, 0, 10);

  const voteCountGte = finiteRange(searchParams.get("votes_gte"), 0, 0, 500);

  const withRuntimeGte = finiteRange(
    searchParams.get("runtime_gte"),
    0,
    0,
    360,
  );
  const withRuntimeLte = finiteRange(
    searchParams.get("runtime_lte"),
    360,
    0,
    360,
  );

  const watchRegion = optionValue(
    searchParams.get("region"),
    WATCH_REGION_OPTIONS.map((o) => o.value),
    defaults.watch_region,
  );
  const providersParam = searchParams.get("providers");
  const watchProviders = providersParam
    ? [...new Set(providersParam.split(/[,|]/).filter(positiveId).map(Number))]
    : [];

  const monetizationType = optionValue(
    searchParams.get("monetization"),
    ["all", "flatrate", "free", "rent", "buy"],
    "all",
  );

  return {
    sort_by: sortBy,
    with_genres: withGenres,
    keywords,
    release_date_preset: releaseDatePreset,
    release_date_gte: releaseDateGte,
    release_date_lte: releaseDateLte,
    certification,
    original_language: originalLanguage,
    vote_average_gte: Math.min(voteAverageGte, voteAverageLte),
    vote_average_lte: Math.max(voteAverageGte, voteAverageLte),
    vote_count_gte: voteCountGte,
    with_runtime_gte: Math.min(withRuntimeGte, withRuntimeLte),
    with_runtime_lte: Math.max(withRuntimeGte, withRuntimeLte),
    watch_region: watchRegion,
    watch_providers: watchProviders,
    monetization_type: monetizationType,
  };
}

export function serializeFiltersToParams(
  filters: DiscoverFilterState,
  page: number = 1,
  defaults: DiscoverFilterState = DEFAULT_DISCOVER_FILTERS,
): string {
  const params = new URLSearchParams();

  if (filters.sort_by && filters.sort_by !== defaults.sort_by) {
    params.set("sort_by", filters.sort_by);
  }

  if (filters.with_genres.length > 0) {
    params.set("with_genres", filters.with_genres.join(","));
  }

  if (filters.keywords.length > 0) {
    params.set("with_keywords", filters.keywords.map((k) => k.id).join(","));
    params.set(
      "keywords_names",
      filters.keywords.map((k) => encodeURIComponent(k.name)).join(","),
    );
  }

  if (filters.release_date_preset && filters.release_date_preset !== "all") {
    params.set("release_preset", filters.release_date_preset);
  } else {
    if (filters.release_date_gte)
      params.set("release_date_gte", filters.release_date_gte);
    if (filters.release_date_lte)
      params.set("release_date_lte", filters.release_date_lte);
  }

  if (filters.certification && filters.certification !== "all") {
    params.set("certification", filters.certification);
  }

  if (filters.original_language && filters.original_language !== "all") {
    params.set("language", filters.original_language);
  }

  if (filters.vote_average_gte > 0) {
    params.set("score_gte", String(filters.vote_average_gte));
  }

  if (filters.vote_average_lte < 10) {
    params.set("score_lte", String(filters.vote_average_lte));
  }

  if (filters.vote_count_gte > 0) {
    params.set("votes_gte", String(filters.vote_count_gte));
  }

  if (filters.with_runtime_gte > 0) {
    params.set("runtime_gte", String(filters.with_runtime_gte));
  }

  if (filters.with_runtime_lte < 360) {
    params.set("runtime_lte", String(filters.with_runtime_lte));
  }

  if (
    filters.watch_region &&
    filters.watch_region !== DEFAULT_DISCOVER_FILTERS.watch_region
  ) {
    params.set("region", filters.watch_region);
  }

  if (filters.watch_providers.length > 0) {
    params.set("providers", filters.watch_providers.join("|"));
  }

  if (filters.monetization_type && filters.monetization_type !== "all") {
    params.set("monetization", filters.monetization_type);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  return params.toString();
}

export function buildTMDBFilters(
  filters: DiscoverFilterState,
  page: number = 1,
): DiscoverMovieFilters {
  const result: DiscoverMovieFilters = {
    page,
    sort_by: filters.sort_by,
  };

  if (filters.with_genres.length > 0) {
    result.with_genres = filters.with_genres.join(",");
  }

  if (filters.keywords.length > 0) {
    result.with_keywords = filters.keywords.map((k) => k.id).join(",");
  }

  // Release dates resolution
  if (filters.release_date_preset === "2026") {
    result["primary_release_date.gte"] = "2026-01-01";
    result["primary_release_date.lte"] = "2026-12-31";
  } else if (filters.release_date_preset === "2025") {
    result["primary_release_date.gte"] = "2025-01-01";
    result["primary_release_date.lte"] = "2025-12-31";
  } else if (filters.release_date_preset === "2020-2024") {
    result["primary_release_date.gte"] = "2020-01-01";
    result["primary_release_date.lte"] = "2024-12-31";
  } else if (filters.release_date_preset === "2010s") {
    result["primary_release_date.gte"] = "2010-01-01";
    result["primary_release_date.lte"] = "2019-12-31";
  } else if (filters.release_date_preset === "classic") {
    result["primary_release_date.lte"] = "1999-12-31";
  } else {
    if (filters.release_date_gte)
      result["primary_release_date.gte"] = filters.release_date_gte;
    if (filters.release_date_lte)
      result["primary_release_date.lte"] = filters.release_date_lte;
  }

  // Certification
  if (filters.certification && filters.certification !== "all") {
    result.certification_country = "US";
    result.certification = filters.certification;
  }

  // Language
  if (filters.original_language && filters.original_language !== "all") {
    result.with_original_language = filters.original_language;
  }

  // User Score (2-way slider)
  if (filters.vote_average_gte > 0) {
    result["vote_average.gte"] = filters.vote_average_gte;
  }
  if (filters.vote_average_lte < 10) {
    result["vote_average.lte"] = filters.vote_average_lte;
  }

  // Minimum votes (1-way slider)
  if (filters.vote_count_gte > 0) {
    result["vote_count.gte"] = filters.vote_count_gte;
  } else if (filters.sort_by.startsWith("vote_average")) {
    result["vote_count.gte"] = 50;
  }

  // Runtime (2-way slider)
  if (filters.with_runtime_gte > 0) {
    result["with_runtime.gte"] = filters.with_runtime_gte;
  }
  if (filters.with_runtime_lte < 360) {
    result["with_runtime.lte"] = filters.with_runtime_lte;
  }

  // Watch providers
  if (filters.watch_providers.length > 0) {
    result.watch_region = filters.watch_region || "US";
    result.with_watch_providers = filters.watch_providers.join("|");
    if (filters.monetization_type && filters.monetization_type !== "all") {
      result.with_watch_monetization_types = filters.monetization_type;
    }
  }

  return result;
}

export function countActiveFilters(
  filters: DiscoverFilterState,
  defaults = DEFAULT_DISCOVER_FILTERS,
): number {
  let count = 0;
  if (filters.sort_by !== defaults.sort_by) count++;
  if (filters.with_genres.length > 0) count += filters.with_genres.length;
  if (filters.keywords.length > 0) count += filters.keywords.length;
  if (
    filters.release_date_preset !== "all" ||
    filters.release_date_gte ||
    filters.release_date_lte
  )
    count++;
  if (filters.certification !== "all") count++;
  if (filters.original_language !== "all") count++;
  if (filters.vote_average_gte > 0 || filters.vote_average_lte < 10) count++;
  if (filters.vote_count_gte > 0) count++;
  if (filters.with_runtime_gte > 0 || filters.with_runtime_lte < 360) count++;
  if (filters.watch_providers.length > 0)
    count += filters.watch_providers.length;
  return count;
}

export function isDefaultFilterState(
  filters: DiscoverFilterState,
  defaults = DEFAULT_DISCOVER_FILTERS,
): boolean {
  return countActiveFilters(filters, defaults) === 0;
}
