export interface DiscoverFilterState {
  sort_by: string;
  with_genres: string[]; // array of genre IDs
  keywords: { id: number; name: string }[]; // selected keyword objects
  release_date_gte?: string;
  release_date_lte?: string;
  release_date_preset?: string; // "all", "2026", "2025", "2020-2024", "2010s", "classic"
  certification?: string; // "all", "G", "PG", "PG-13", "R", "NC-17"
  original_language?: string; // "all", "en", "ja", "ko", etc.
  vote_average_gte: number; // 0 to 10
  vote_average_lte: number; // 0 to 10
  vote_count_gte: number; // 0 to 500
  with_runtime_gte: number; // 0 to 360 min
  with_runtime_lte: number; // 0 to 360 min
  watch_region: string; // "US", "ID", "GB", etc.
  watch_providers: number[]; // array of provider IDs
  monetization_type?: string; // "all", "flatrate", "free", "rent", "buy"
}

export const DEFAULT_DISCOVER_FILTERS: DiscoverFilterState = {
  sort_by: "popularity.desc",
  with_genres: [],
  keywords: [],
  release_date_preset: "all",
  certification: "all",
  original_language: "all",
  vote_average_gte: 0,
  vote_average_lte: 10,
  vote_count_gte: 0,
  with_runtime_gte: 0,
  with_runtime_lte: 360,
  watch_region: "US",
  watch_providers: [],
  monetization_type: "all",
};

export const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity (High to Low)" },
  { value: "popularity.asc", label: "Popularity (Low to High)" },
  { value: "vote_average.desc", label: "Rating (High to Low)" },
  { value: "vote_average.asc", label: "Rating (Low to High)" },
  { value: "primary_release_date.desc", label: "Release Date (Newest)" },
  { value: "primary_release_date.asc", label: "Release Date (Oldest)" },
  { value: "title.asc", label: "Title (A–Z)" },
  { value: "title.desc", label: "Title (Z–A)" },
  { value: "vote_count.desc", label: "Most Voted" },
];

export const CERTIFICATION_OPTIONS = ["all", "G", "PG", "PG-13", "R", "NC-17"];

export const LANGUAGE_OPTIONS = [
  { value: "all", label: "All Languages" },
  { value: "en", label: "English" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "id", label: "Indonesian" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "it", label: "Italian" },
];

export const WATCH_REGION_OPTIONS = [
  { value: "US", label: "United States (US)" },
  { value: "ID", label: "Indonesia (ID)" },
  { value: "GB", label: "United Kingdom (GB)" },
  { value: "CA", label: "Canada (CA)" },
  { value: "AU", label: "Australia (AU)" },
  { value: "JP", label: "Japan (JP)" },
  { value: "KR", label: "South Korea (KR)" },
  { value: "DE", label: "Germany (DE)" },
  { value: "FR", label: "France (FR)" },
];

export const TOP_WATCH_PROVIDERS = [
  { id: 8, name: "Netflix", logo: "/rK1KljqmbvO9HQa1PBFLILWah72.png" },
  { id: 337, name: "Disney+", logo: "/5eZ872CghnHFLB1j8grszbrx0dx.png" },
  { id: 9, name: "Prime Video", logo: "/gMZdpavHmxFNnLpMHwVxfqeux2g.png" },
  { id: 350, name: "Apple TV+", logo: "/9icYBfYFcwgCbky5VdGUIKJ4C5i.png" },
  { id: 1899, name: "Max", logo: "/64fLWeSyZ1KQZhIdvTdy4QHeWty.png" },
  { id: 15, name: "Hulu", logo: "/44uAnmSqvA4yBOdbPWN8YgQHjWm.png" },
  { id: 531, name: "Paramount+", logo: "/fi83B1oztoS47xumemJasxGoLOU.png" },
  { id: 283, name: "Crunchyroll", logo: "/8Gt1btEpbvN3kW1Fkgnv5tN0r7n.png" },
];
