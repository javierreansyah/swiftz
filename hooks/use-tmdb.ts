"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  searchMoviesClient,
  getMoviesByGenresClient,
  getPopularMoviesClient,
  getTrendingMoviesClient,
  getNowPlayingMoviesClient,
  getTopRatedMoviesClient,
  getUpcomingMoviesClient,
  discoverMoviesClient,
  searchKeywordsClient,
  getWatchProvidersClient,
  getMovieCastClient,
  getMovieRecommendationsClient,
  getMovieReviewsClient,
  getMovieVideosClient,
  getMovieImagesClient,
  getMovieAccountStates,
  setMovieFavorite,
  setMovieWatchlist,
  setMovieRating,
  deleteMovieRating,
  getAccountFavoriteMovies,
  getAccountWatchlistMovies,
  getAccountRatedMovies,
  getPopularTVShowsClient,
  getTrendingTVShowsClient,
  getTopRatedTVShowsClient,
  getOnTheAirTVShowsClient,
  getAiringTodayTVShowsClient,
  getTVDetailsClient,
  getTVCreditsClient,
  getTVVideosClient,
  getTVRecommendationsClient,
  discoverTVShowsClient,
  getPopularPeopleClient,
  getPersonDetailsClient,
  getPersonCombinedCreditsClient,
  getPersonExternalIdsClient,
  searchMultiClient,
  searchTVClient,
  searchPeopleClient,
  searchCollectionsClient,
  searchCompaniesClient,
  getSearchTypeCountsClient,
  getTVAccountStates,
  setTVFavorite,
  setTVWatchlist,
  setTVRating,
  deleteTVRating,
  getTVReviewsClient,
} from "@/lib/tmdb-client";
import { DiscoverMovieFilters, DiscoverTVFilters } from "@/types";
import { AccountStates } from "@/types/auth";

export function useSearchMoviesQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-movies", query, page],
    queryFn: () => searchMoviesClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useMoviesByGenresQuery(genreQuery: string, page: number = 1) {
  return useQuery({
    queryKey: ["genres-movies", genreQuery, page],
    queryFn: () => getMoviesByGenresClient(genreQuery, page),
    enabled: Boolean(genreQuery && genreQuery.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function usePopularMoviesQuery(page: number = 1) {
  return useQuery({
    queryKey: ["popular-movies", page],
    queryFn: () => getPopularMoviesClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useTrendingMoviesQuery(page: number = 1) {
  return useQuery({
    queryKey: ["trending-movies", page],
    queryFn: () => getTrendingMoviesClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useNowPlayingMoviesQuery(page: number = 1) {
  return useQuery({
    queryKey: ["now-playing-movies", page],
    queryFn: () => getNowPlayingMoviesClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useTopRatedMoviesQuery(page: number = 1) {
  return useQuery({
    queryKey: ["top-rated-movies", page],
    queryFn: () => getTopRatedMoviesClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useUpcomingMoviesQuery(page: number = 1) {
  return useQuery({
    queryKey: ["upcoming-movies", page],
    queryFn: () => getUpcomingMoviesClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useDiscoverMoviesQuery(filters: DiscoverMovieFilters = {}) {
  return useQuery({
    queryKey: ["discover-movies", filters],
    queryFn: () => discoverMoviesClient(filters),
    placeholderData: keepPreviousData,
  });
}

export function useKeywordSearchQuery(query: string) {
  return useQuery({
    queryKey: ["search-keywords", query],
    queryFn: () => searchKeywordsClient(query),
    enabled: Boolean(query && query.trim().length >= 2),
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
}

export function useWatchProvidersQuery(region: string = "US") {
  return useQuery({
    queryKey: ["watch-providers", region],
    queryFn: () => getWatchProvidersClient(region),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}


export function useMovieCastQuery(id: string) {
  return useQuery({
    queryKey: ["movie-cast", id],
    queryFn: () => getMovieCastClient(id),
    enabled: Boolean(id),
  });
}

export function useMovieRecommendationsQuery(id: string, page: number = 1) {
  return useQuery({
    queryKey: ["movie-recommendations", id, page],
    queryFn: () => getMovieRecommendationsClient(id, page),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
}

export function useMovieReviewsQuery(
  movieId: string | number,
  page: number = 1
) {
  return useQuery({
    queryKey: ["movie-reviews", String(movieId), page],
    queryFn: () => getMovieReviewsClient(movieId, page),
    enabled: Boolean(movieId),
    placeholderData: keepPreviousData,
  });
}

export function useMovieVideosQuery(id: string | number) {
  return useQuery({
    queryKey: ["movie-videos", String(id)],
    queryFn: () => getMovieVideosClient(id),
    enabled: Boolean(id),
  });
}

export function useMovieImagesQuery(id: string | number) {
  return useQuery({
    queryKey: ["movie-images", String(id)],
    queryFn: () => getMovieImagesClient(id),
    enabled: Boolean(id),
  });
}

// -------------------------------------------------------------
// Authenticated Account Queries & Mutations
// -------------------------------------------------------------

export function useMovieAccountStatesQuery(
  movieId: string | number,
  sessionId: string | null
) {
  return useQuery({
    queryKey: ["movie-account-states", String(movieId), sessionId],
    queryFn: () => getMovieAccountStates(movieId, sessionId!),
    enabled: Boolean(movieId && sessionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      sessionId,
      movieId,
      favorite,
    }: {
      accountId: number;
      sessionId: string;
      movieId: number;
      favorite: boolean;
    }) => setMovieFavorite(accountId, sessionId, movieId, favorite),
    onMutate: async ({ movieId, sessionId, favorite }) => {
      await queryClient.cancelQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      const previousStates = queryClient.getQueryData<AccountStates>([
        "movie-account-states",
        String(movieId),
        sessionId,
      ]);

      if (previousStates) {
        queryClient.setQueryData<AccountStates>(
          ["movie-account-states", String(movieId), sessionId],
          { ...previousStates, favorite }
        );
      }
      return { previousStates };
    },
    onError: (_err, { movieId, sessionId }, context) => {
      if (context?.previousStates) {
        queryClient.setQueryData(
          ["movie-account-states", String(movieId), sessionId],
          context.previousStates
        );
      }
    },
    onSettled: (_data, _err, { movieId, sessionId, accountId }) => {
      queryClient.invalidateQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-favorites", accountId, sessionId],
      });
    },
  });
}

export function useToggleWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      sessionId,
      movieId,
      watchlist,
    }: {
      accountId: number;
      sessionId: string;
      movieId: number;
      watchlist: boolean;
    }) => setMovieWatchlist(accountId, sessionId, movieId, watchlist),
    onMutate: async ({ movieId, sessionId, watchlist }) => {
      await queryClient.cancelQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      const previousStates = queryClient.getQueryData<AccountStates>([
        "movie-account-states",
        String(movieId),
        sessionId,
      ]);

      if (previousStates) {
        queryClient.setQueryData<AccountStates>(
          ["movie-account-states", String(movieId), sessionId],
          { ...previousStates, watchlist }
        );
      }
      return { previousStates };
    },
    onError: (_err, { movieId, sessionId }, context) => {
      if (context?.previousStates) {
        queryClient.setQueryData(
          ["movie-account-states", String(movieId), sessionId],
          context.previousStates
        );
      }
    },
    onSettled: (_data, _err, { movieId, sessionId, accountId }) => {
      queryClient.invalidateQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-watchlist", accountId, sessionId],
      });
    },
  });
}

export function useRateMovieMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      movieId,
      sessionId,
      rating,
    }: {
      movieId: number;
      sessionId: string;
      rating: number;
    }) => setMovieRating(movieId, sessionId, rating),
    onSettled: (_data, _err, { movieId, sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-rated"],
      });
    },
  });
}

export function useDeleteRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      movieId,
      sessionId,
    }: {
      movieId: number;
      sessionId: string;
    }) => deleteMovieRating(movieId, sessionId),
    onSettled: (_data, _err, { movieId, sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["movie-account-states", String(movieId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-rated"],
      });
    },
  });
}

export function useAccountFavoritesQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1
) {
  return useQuery({
    queryKey: ["account-favorites", accountId, sessionId, page],
    queryFn: () => getAccountFavoriteMovies(accountId!, sessionId!, page),
    enabled: Boolean(accountId && sessionId),
    placeholderData: keepPreviousData,
  });
}

export function useAccountWatchlistQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1
) {
  return useQuery({
    queryKey: ["account-watchlist", accountId, sessionId, page],
    queryFn: () => getAccountWatchlistMovies(accountId!, sessionId!, page),
    enabled: Boolean(accountId && sessionId),
    placeholderData: keepPreviousData,
  });
}

export function useAccountRatedQuery(
  accountId: number | undefined,
  sessionId: string | null,
  page: number = 1
) {
  return useQuery({
    queryKey: ["account-rated", accountId, sessionId, page],
    queryFn: () => getAccountRatedMovies(accountId!, sessionId!, page),
    enabled: Boolean(accountId && sessionId),
    placeholderData: keepPreviousData,
  });
}

// -------------------------------------------------------------
// TV Shows Query Hooks
// -------------------------------------------------------------

export function usePopularTVShowsQuery(page: number = 1) {
  return useQuery({
    queryKey: ["popular-tv", page],
    queryFn: () => getPopularTVShowsClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useTrendingTVShowsQuery(page: number = 1) {
  return useQuery({
    queryKey: ["trending-tv", page],
    queryFn: () => getTrendingTVShowsClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useTopRatedTVShowsQuery(page: number = 1) {
  return useQuery({
    queryKey: ["top-rated-tv", page],
    queryFn: () => getTopRatedTVShowsClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useOnTheAirTVShowsQuery(page: number = 1) {
  return useQuery({
    queryKey: ["on-the-air-tv", page],
    queryFn: () => getOnTheAirTVShowsClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useAiringTodayTVShowsQuery(page: number = 1) {
  return useQuery({
    queryKey: ["airing-today-tv", page],
    queryFn: () => getAiringTodayTVShowsClient(page),
    placeholderData: keepPreviousData,
  });
}

export function useDiscoverTVShowsQuery(filters: DiscoverTVFilters = {}) {
  return useQuery({
    queryKey: ["discover-tv", filters],
    queryFn: () => discoverTVShowsClient(filters),
    placeholderData: keepPreviousData,
  });
}

export function useTVDetailsQuery(id: string | number) {
  return useQuery({
    queryKey: ["tv-details", String(id)],
    queryFn: () => getTVDetailsClient(id),
    enabled: Boolean(id),
  });
}

export function useTVCreditsQuery(id: string | number) {
  return useQuery({
    queryKey: ["tv-credits", String(id)],
    queryFn: () => getTVCreditsClient(id),
    enabled: Boolean(id),
  });
}

export function useTVVideosQuery(id: string | number) {
  return useQuery({
    queryKey: ["tv-videos", String(id)],
    queryFn: () => getTVVideosClient(id),
    enabled: Boolean(id),
  });
}

export function useTVRecommendationsQuery(
  id: string | number,
  page: number = 1
) {
  return useQuery({
    queryKey: ["tv-recommendations", String(id), page],
    queryFn: () => getTVRecommendationsClient(id, page),
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
  });
}

// -------------------------------------------------------------
// People Query Hooks
// -------------------------------------------------------------

export function usePopularPeopleQuery(page: number = 1) {
  return useQuery({
    queryKey: ["popular-people", page],
    queryFn: () => getPopularPeopleClient(page),
    placeholderData: keepPreviousData,
  });
}

export function usePersonDetailsQuery(id: string | number) {
  return useQuery({
    queryKey: ["person-details", String(id)],
    queryFn: () => getPersonDetailsClient(id),
    enabled: Boolean(id),
  });
}

export function usePersonCombinedCreditsQuery(id: string | number) {
  return useQuery({
    queryKey: ["person-credits", String(id)],
    queryFn: () => getPersonCombinedCreditsClient(id),
    enabled: Boolean(id),
  });
}

export function usePersonExternalIdsQuery(id: string | number) {
  return useQuery({
    queryKey: ["person-external-ids", String(id)],
    queryFn: () => getPersonExternalIdsClient(id),
    enabled: Boolean(id),
  });
}

// -------------------------------------------------------------
// Multi & Categorized Search Query Hooks
// -------------------------------------------------------------

export function useMultiSearchQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-multi", query, page],
    queryFn: () => searchMultiClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2, // 2 mins cache
  });
}

export function useSearchTVQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-tv", query, page],
    queryFn: () => searchTVClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useSearchPeopleQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-people", query, page],
    queryFn: () => searchPeopleClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useSearchCollectionsQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-collections", query, page],
    queryFn: () => searchCollectionsClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useSearchCompaniesQuery(query: string, page: number = 1) {
  return useQuery({
    queryKey: ["search-companies", query, page],
    queryFn: () => searchCompaniesClient(query, page),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useSearchKeywordsQuery(query: string) {
  return useQuery({
    queryKey: ["search-keywords-list", query],
    queryFn: () => searchKeywordsClient(query),
    enabled: Boolean(query && query.trim().length > 0),
    placeholderData: keepPreviousData,
  });
}

export function useSearchTypeCountsQuery(query: string) {
  return useQuery({
    queryKey: ["search-counts", query],
    queryFn: () => getSearchTypeCountsClient(query),
    enabled: Boolean(query && query.trim().length > 0),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTVAccountStatesQuery(
  tvId: string | number,
  sessionId: string | null
) {
  return useQuery({
    queryKey: ["tv-account-states", String(tvId), sessionId],
    queryFn: () => getTVAccountStates(tvId, sessionId!),
    enabled: Boolean(tvId && sessionId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useToggleTVFavoriteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      sessionId,
      tvId,
      favorite,
    }: {
      accountId: number;
      sessionId: string;
      tvId: number;
      favorite: boolean;
    }) => setTVFavorite(accountId, sessionId, tvId, favorite),
    onMutate: async ({ tvId, sessionId, favorite }) => {
      await queryClient.cancelQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
      const previousStates = queryClient.getQueryData<AccountStates>([
        "tv-account-states",
        String(tvId),
        sessionId,
      ]);

      if (previousStates) {
        queryClient.setQueryData<AccountStates>(
          ["tv-account-states", String(tvId), sessionId],
          { ...previousStates, favorite }
        );
      }
      return { previousStates };
    },
    onError: (_err, { tvId, sessionId }, context) => {
      if (context?.previousStates) {
        queryClient.setQueryData(
          ["tv-account-states", String(tvId), sessionId],
          context.previousStates
        );
      }
    },
    onSettled: (_data, _err, { tvId, sessionId, accountId }) => {
      queryClient.invalidateQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-favorites", accountId, sessionId],
      });
    },
  });
}

export function useToggleTVWatchlistMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      sessionId,
      tvId,
      watchlist,
    }: {
      accountId: number;
      sessionId: string;
      tvId: number;
      watchlist: boolean;
    }) => setTVWatchlist(accountId, sessionId, tvId, watchlist),
    onMutate: async ({ tvId, sessionId, watchlist }) => {
      await queryClient.cancelQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
      const previousStates = queryClient.getQueryData<AccountStates>([
        "tv-account-states",
        String(tvId),
        sessionId,
      ]);

      if (previousStates) {
        queryClient.setQueryData<AccountStates>(
          ["tv-account-states", String(tvId), sessionId],
          { ...previousStates, watchlist }
        );
      }
      return { previousStates };
    },
    onError: (_err, { tvId, sessionId }, context) => {
      if (context?.previousStates) {
        queryClient.setQueryData(
          ["tv-account-states", String(tvId), sessionId],
          context.previousStates
        );
      }
    },
    onSettled: (_data, _err, { tvId, sessionId, accountId }) => {
      queryClient.invalidateQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["account-watchlist", accountId, sessionId],
      });
    },
  });
}

export function useRateTVMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tvId,
      rating,
      sessionId,
    }: {
      tvId: number;
      rating: number;
      sessionId: string;
    }) => setTVRating(tvId, sessionId, rating),
    onSettled: (_data, _err, { tvId, sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
    },
  });
}

export function useDeleteTVRatingMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tvId,
      sessionId,
    }: {
      tvId: number;
      sessionId: string;
    }) => deleteTVRating(tvId, sessionId),
    onSettled: (_data, _err, { tvId, sessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["tv-account-states", String(tvId), sessionId],
      });
    },
  });
}

export function useTVReviewsQuery(
  tvId: string | number,
  page: number = 1
) {
  return useQuery({
    queryKey: ["tv-reviews", String(tvId), page],
    queryFn: () => getTVReviewsClient(tvId, page),
    enabled: Boolean(tvId),
    staleTime: 1000 * 60 * 5,
  });
}


