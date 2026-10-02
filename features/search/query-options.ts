import {
  queryOptions,
  keepPreviousData,
  type QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/tmdb/query-keys";
import {
  searchMoviesClient,
  searchKeywordsClient,
  searchMultiClient,
  searchTVClient,
  searchPeopleClient,
  searchCollectionsClient,
  searchCompaniesClient,
} from "@/features/search/api/browser";
export function searchMoviesOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchMovies(query, page),
    queryFn: ({ signal }) => searchMoviesClient(query, page, signal),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function multiSearchOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchMulti(query, page),
    queryFn: ({ signal }) => searchMultiClient(query, page, signal),
    enabled: Boolean(query && query.trim().length >= 2),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 mins cache
  });
}

export function searchTVOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchTv(query, page),
    queryFn: ({ signal }) => searchTVClient(query, page, signal),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function searchPeopleOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchPeople(query, page),
    queryFn: ({ signal }) => searchPeopleClient(query, page, signal),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function searchCollectionsOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchCollections(query, page),
    queryFn: ({ signal }) => searchCollectionsClient(query, page, signal),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function searchCompaniesOptions(query: string, page: number = 1) {
  return queryOptions({
    queryKey: queryKeys.searchCompanies(query, page),
    queryFn: ({ signal }) => searchCompaniesClient(query, page, signal),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function searchKeywordsOptions(query: string, autocomplete = false) {
  return queryOptions({
    queryKey: queryKeys.searchKeywords(query),
    queryFn: ({ signal }) => searchKeywordsClient(query, signal),
    enabled: query.trim().length >= (autocomplete ? 2 : 1),
    staleTime: autocomplete ? 1000 * 60 * 5 : undefined,
    placeholderData: autocomplete ? undefined : keepPreviousData,
  });
}

export function searchTypeCountsOptions(client: QueryClient, query: string) {
  return queryOptions({
    queryKey: queryKeys.searchCounts(query),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const [movies, tv, people, collections, keywords, companies] =
        await Promise.all([
          client.fetchQuery(searchMoviesOptions(query, 1)),
          client.fetchQuery(searchTVOptions(query, 1)),
          client.fetchQuery(searchPeopleOptions(query, 1)),
          client.fetchQuery(searchCollectionsOptions(query, 1)),
          client.fetchQuery(searchKeywordsOptions(query)),
          client.fetchQuery(searchCompaniesOptions(query, 1)),
        ]);
      return {
        movies: movies.total_results,
        tv: tv.total_results,
        people: people.total_results,
        collections: collections.total_results,
        keywords: keywords.total_results,
        companies: companies.total_results,
        networks: 0,
        awards: 0,
      };
    },
  });
}
