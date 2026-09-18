import { DiscoverMovieFilters } from "@/types";
import { DiscoverFilterState, DEFAULT_DISCOVER_FILTERS } from "./types";

export function parseFiltersFromParams(
  searchParams: URLSearchParams
): DiscoverFilterState {
  const sort_by = searchParams.get("sort_by") || DEFAULT_DISCOVER_FILTERS.sort_by;
  const genresParam = searchParams.get("with_genres");
  const with_genres = genresParam ? genresParam.split(",").filter(Boolean) : [];

  const keywordsParam = searchParams.get("with_keywords");
  const keywordsNamesParam = searchParams.get("keywords_names");
  const keywordIds = keywordsParam ? keywordsParam.split(",").filter(Boolean) : [];
  const keywordNames = keywordsNamesParam ? keywordsNamesParam.split(",").filter(Boolean) : [];

  const keywords = keywordIds.map((id, index) => ({
    id: Number(id),
    name: decodeURIComponent(keywordNames[index] || id),
  }));

  const release_date_preset =
    searchParams.get("release_preset") || DEFAULT_DISCOVER_FILTERS.release_date_preset;
  const release_date_gte = searchParams.get("release_date_gte") || undefined;
  const release_date_lte = searchParams.get("release_date_lte") || undefined;

  const certification =
    searchParams.get("certification") || DEFAULT_DISCOVER_FILTERS.certification;
  const original_language =
    searchParams.get("language") || DEFAULT_DISCOVER_FILTERS.original_language;

  const vote_average_gte = Number(searchParams.get("score_gte")) || 0;
  const vote_average_lte =
    searchParams.get("score_lte") !== null
      ? Number(searchParams.get("score_lte"))
      : 10;

  const vote_count_gte = Number(searchParams.get("votes_gte")) || 0;

  const with_runtime_gte = Number(searchParams.get("runtime_gte")) || 0;
  const with_runtime_lte =
    searchParams.get("runtime_lte") !== null
      ? Number(searchParams.get("runtime_lte"))
      : 360;

  const watch_region =
    searchParams.get("region") || DEFAULT_DISCOVER_FILTERS.watch_region;
  const providersParam = searchParams.get("providers");
  const watch_providers = providersParam
    ? providersParam
        .split(/[,|]/)
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0)
    : [];

  const monetization_type =
    searchParams.get("monetization") || DEFAULT_DISCOVER_FILTERS.monetization_type;

  return {
    sort_by,
    with_genres,
    keywords,
    release_date_preset,
    release_date_gte,
    release_date_lte,
    certification,
    original_language,
    vote_average_gte,
    vote_average_lte,
    vote_count_gte,
    with_runtime_gte,
    with_runtime_lte,
    watch_region,
    watch_providers,
    monetization_type,
  };
}

export function serializeFiltersToParams(
  filters: DiscoverFilterState,
  page: number = 1
): string {
  const params = new URLSearchParams();

  if (filters.sort_by && filters.sort_by !== DEFAULT_DISCOVER_FILTERS.sort_by) {
    params.set("sort_by", filters.sort_by);
  }

  if (filters.with_genres.length > 0) {
    params.set("with_genres", filters.with_genres.join(","));
  }

  if (filters.keywords.length > 0) {
    params.set("with_keywords", filters.keywords.map((k) => k.id).join(","));
    params.set(
      "keywords_names",
      filters.keywords.map((k) => encodeURIComponent(k.name)).join(",")
    );
  }

  if (filters.release_date_preset && filters.release_date_preset !== "all") {
    params.set("release_preset", filters.release_date_preset);
  } else {
    if (filters.release_date_gte) params.set("release_date_gte", filters.release_date_gte);
    if (filters.release_date_lte) params.set("release_date_lte", filters.release_date_lte);
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

  if (filters.watch_region && filters.watch_region !== DEFAULT_DISCOVER_FILTERS.watch_region) {
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
  page: number = 1
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
    if (filters.release_date_gte) result["primary_release_date.gte"] = filters.release_date_gte;
    if (filters.release_date_lte) result["primary_release_date.lte"] = filters.release_date_lte;
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

export function countActiveFilters(filters: DiscoverFilterState): number {
  let count = 0;
  if (filters.sort_by !== DEFAULT_DISCOVER_FILTERS.sort_by) count++;
  if (filters.with_genres.length > 0) count += filters.with_genres.length;
  if (filters.keywords.length > 0) count += filters.keywords.length;
  if (filters.release_date_preset !== "all" || filters.release_date_gte || filters.release_date_lte)
    count++;
  if (filters.certification !== "all") count++;
  if (filters.original_language !== "all") count++;
  if (filters.vote_average_gte > 0 || filters.vote_average_lte < 10) count++;
  if (filters.vote_count_gte > 0) count++;
  if (filters.with_runtime_gte > 0 || filters.with_runtime_lte < 360) count++;
  if (filters.watch_providers.length > 0) count += filters.watch_providers.length;
  return count;
}

export function isDefaultFilterState(filters: DiscoverFilterState): boolean {
  return countActiveFilters(filters) === 0;
}
