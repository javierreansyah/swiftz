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
} from "@/lib/tmdb-client";
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
