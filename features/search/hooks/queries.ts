"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  searchMoviesOptions,
  multiSearchOptions,
  searchTVOptions,
  searchPeopleOptions,
  searchCollectionsOptions,
  searchCompaniesOptions,
  searchKeywordsOptions,
  searchTypeCountsOptions,
} from "@/features/search/query-options";
export function useSearchMoviesQuery(query: string, page: number = 1) {
  return useQuery(searchMoviesOptions(query, page));
}

export function useKeywordSearchQuery(query: string) {
  return useQuery(searchKeywordsOptions(query, true));
}

export function useMultiSearchQuery(query: string, page: number = 1) {
  return useQuery(multiSearchOptions(query, page));
}

export function useSearchTVQuery(query: string, page: number = 1) {
  return useQuery(searchTVOptions(query, page));
}

export function useSearchPeopleQuery(query: string, page: number = 1) {
  return useQuery(searchPeopleOptions(query, page));
}

export function useSearchCollectionsQuery(query: string, page: number = 1) {
  return useQuery(searchCollectionsOptions(query, page));
}

export function useSearchCompaniesQuery(query: string, page: number = 1) {
  return useQuery(searchCompaniesOptions(query, page));
}

export function useSearchKeywordsQuery(query: string) {
  return useQuery(searchKeywordsOptions(query));
}

export function useSearchTypeCountsQuery(query: string) {
  return useQuery(searchTypeCountsOptions(useQueryClient(), query));
}
