import type {
  SearchData,
  TMDBKeywordSearchResponse,
  MultiSearchResponse,
  SearchGenericResponse,
  SearchCollectionItem,
  SearchCompanyItem,
} from "@/lib/tmdb/types/search";
import type { PopularTVData } from "@/lib/tmdb/types/tv";
import type { PopularPeopleData } from "@/lib/tmdb/types/people";
import { fetchTMDBClient } from "@/lib/tmdb/browser";
export async function searchMoviesClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<SearchData> {
  if (!query.trim()) {
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
  }
  return fetchTMDBClient<SearchData>(
    "/search/movie",
    { query: query.trim(), page },
    { signal },
  );
}

export async function searchKeywordsClient(
  query: string,
  signal?: AbortSignal,
): Promise<TMDBKeywordSearchResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<TMDBKeywordSearchResponse>(
    "/search/keyword",
    {
      query: query.trim(),
    },
    { signal },
  );
}

export async function searchMultiClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<MultiSearchResponse> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<MultiSearchResponse>(
    "/search/multi",
    {
      query: query.trim(),
      page,
    },
    { signal },
  );
}

export async function searchTVClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularTVData> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<PopularTVData>(
    "/search/tv",
    { query: query.trim(), page },
    { signal },
  );
}

export async function searchPeopleClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<PopularPeopleData> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<PopularPeopleData>(
    "/search/person",
    { query: query.trim(), page },
    { signal },
  );
}

export async function searchCollectionsClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<SearchGenericResponse<SearchCollectionItem>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<SearchGenericResponse<SearchCollectionItem>>(
    "/search/collection",
    { query: query.trim(), page },
    { signal },
  );
}

export async function searchCompaniesClient(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<SearchGenericResponse<SearchCompanyItem>> {
  if (!query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
  return fetchTMDBClient<SearchGenericResponse<SearchCompanyItem>>(
    "/search/company",
    { query: query.trim(), page },
    { signal },
  );
}
