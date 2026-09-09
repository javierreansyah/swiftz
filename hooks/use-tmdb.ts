"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  searchMoviesClient,
  getMoviesByGenresClient,
  getPopularMoviesClient,
  getTrendingMoviesClient,
  getMovieCastClient,
  getMovieRecommendationsClient,
} from "@/lib/tmdb-client";

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
