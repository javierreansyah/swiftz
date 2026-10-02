import { listingOptions } from "@/lib/tmdb/listing-options";
import {
  buildTMDBFilters,
  isDefaultFilterState,
} from "@/features/movies/discovery/filter-utils";
import {
  DEFAULT_DISCOVER_FILTERS,
  type DiscoverFilterState,
} from "@/features/movies/discovery/types";
import {
  discoverMoviesOptions,
  popularMoviesOptions,
  topRatedMoviesOptions,
  nowPlayingMoviesOptions,
  upcomingMoviesOptions,
} from "@/features/movies/query-options";
export const movieCategories = {
  popular: {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(popularMoviesOptions(page)),
  },
  "top-rated": {
    sort: "vote_average.desc",
    options: (page: number) => listingOptions(topRatedMoviesOptions(page)),
  },
  "now-playing": {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(nowPlayingMoviesOptions(page)),
  },
  upcoming: {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(upcomingMoviesOptions(page)),
  },
} as const;
export type MovieCategoryType = keyof typeof movieCategories;

export function movieCategoryDefaults(
  category: MovieCategoryType,
): DiscoverFilterState {
  return {
    ...DEFAULT_DISCOVER_FILTERS,
    sort_by: movieCategories[category].sort,
  };
}

export function movieCategoryOptions(
  category: MovieCategoryType,
  filters: DiscoverFilterState,
  page: number,
  now = new Date(),
) {
  if (isDefaultFilterState(filters, movieCategoryDefaults(category)))
    return movieCategories[category].options(page);
  const base = { ...filters };
  if (category === "top-rated" && base.vote_count_gte === 0)
    base.vote_count_gte = 200;
  const built = buildTMDBFilters(base, page);
  if (category === "now-playing" || category === "upcoming") {
    const min = new Date(now);
    const max = new Date(now);
    if (category === "now-playing") min.setDate(min.getDate() - 45);
    else max.setDate(max.getDate() + 30);
    built.with_release_type = "2|3";
    built["primary_release_date.gte"] ||= min.toISOString().slice(0, 10);
    built["primary_release_date.lte"] ||= max.toISOString().slice(0, 10);
  }
  return listingOptions(discoverMoviesOptions(built));
}
