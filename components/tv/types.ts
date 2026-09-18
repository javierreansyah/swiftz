export interface TVFilterState {
  sort_by: string;
  with_genres: string[];
  first_air_date_year?: string;
  vote_average_gte: number;
}

export const DEFAULT_TV_FILTERS: TVFilterState = {
  sort_by: "popularity.desc",
  with_genres: [],
  first_air_date_year: "",
  vote_average_gte: 0,
};

export const TV_SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity (High to Low)" },
  { value: "popularity.asc", label: "Popularity (Low to High)" },
  { value: "vote_average.desc", label: "Rating (High to Low)" },
  { value: "vote_average.asc", label: "Rating (Low to High)" },
  { value: "first_air_date.desc", label: "First Air Date (Newest)" },
  { value: "first_air_date.asc", label: "First Air Date (Oldest)" },
  { value: "name.asc", label: "Title (A–Z)" },
];

export const TV_GENRES = [
  { id: "10759", name: "Action & Adventure" },
  { id: "16", name: "Animation" },
  { id: "35", name: "Comedy" },
  { id: "80", name: "Crime" },
  { id: "99", name: "Documentary" },
  { id: "18", name: "Drama" },
  { id: "10751", name: "Family" },
  { id: "10762", name: "Kids" },
  { id: "9648", name: "Mystery" },
  { id: "10763", name: "News" },
  { id: "10764", name: "Reality" },
  { id: "10765", name: "Sci-Fi & Fantasy" },
  { id: "10766", name: "Soap" },
  { id: "10767", name: "Talk" },
  { id: "10768", name: "War & Politics" },
  { id: "37", name: "Western" },
];
