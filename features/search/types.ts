import type { LucideIcon } from "lucide-react";
import type { Movie } from "@/lib/tmdb/types/movie";
import type { TVShow } from "@/lib/tmdb/types/tv";
import type { Person } from "@/lib/tmdb/types/people";
import type {
  SearchCollectionItem,
  SearchCompanyItem,
  TMDBKeyword,
} from "@/lib/tmdb/types/search";
export const SEARCH_CATEGORIES = [
  "movies",
  "tv",
  "people",
  "collections",
  "keywords",
  "companies",
  "networks",
  "awards",
] as const;
export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];
export interface SearchCategoryItem {
  id: SearchCategory;
  label: string;
  count: number;
  icon: LucideIcon;
}

export type SearchDataset =
  | { category: "movies"; items: Movie[] }
  | { category: "tv"; items: TVShow[] }
  | { category: "people"; items: Person[] }
  | { category: "collections"; items: SearchCollectionItem[] }
  | { category: "keywords"; items: TMDBKeyword[] }
  | { category: "companies"; items: SearchCompanyItem[] }
  | { category: "networks" | "awards"; items: [] };
