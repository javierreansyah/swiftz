import { listingOptions } from "@/lib/tmdb/listing-options";
import {
  buildTVFilters,
  hasTVFilters,
} from "@/features/tv/discovery/filter-utils";
import {
  DEFAULT_TV_FILTERS,
  type TVFilterState,
} from "@/features/tv/discovery/types";
import {
  discoverTVShowsOptions,
  popularTVShowsOptions,
  topRatedTVShowsOptions,
  onTheAirTVShowsOptions,
  airingTodayTVShowsOptions,
} from "@/features/tv/query-options";
export const tvCategories = {
  popular: {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(popularTVShowsOptions(page)),
  },
  "top-rated": {
    sort: "vote_average.desc",
    options: (page: number) => listingOptions(topRatedTVShowsOptions(page)),
  },
  "on-the-air": {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(onTheAirTVShowsOptions(page)),
  },
  "airing-today": {
    sort: "popularity.desc",
    options: (page: number) => listingOptions(airingTodayTVShowsOptions(page)),
  },
} as const;
export type TVCategoryType = keyof typeof tvCategories;

export function tvCategoryDefaults(category: TVCategoryType): TVFilterState {
  return { ...DEFAULT_TV_FILTERS, sort_by: tvCategories[category].sort };
}

export function tvCategoryOptions(
  category: TVCategoryType,
  filters: TVFilterState,
  page: number,
  now = new Date(),
) {
  if (!hasTVFilters(filters, tvCategoryDefaults(category)))
    return tvCategories[category].options(page);
  const built = buildTVFilters(filters, page);
  if (category === "top-rated" && !built["vote_average.gte"])
    built["vote_average.gte"] = 7;
  if (category === "on-the-air" || category === "airing-today") {
    const min = new Date(now);
    const max = new Date(now);
    if (category === "on-the-air") {
      min.setDate(min.getDate() - 7);
      max.setDate(max.getDate() + 7);
    }
    built["air_date.gte"] = min.toISOString().slice(0, 10);
    built["air_date.lte"] = max.toISOString().slice(0, 10);
  }
  return listingOptions(discoverTVShowsOptions(built));
}
