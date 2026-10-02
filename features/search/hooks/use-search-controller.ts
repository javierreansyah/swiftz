"use client";
import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useClientQueryRouter } from "@/hooks/use-client-query-router";
import { parsePage } from "@/lib/pagination";
import {
  Film,
  Tv,
  User,
  Layers,
  Tag,
  Building,
  Radio,
  Trophy,
} from "lucide-react";
import {
  useSearchMoviesQuery,
  useSearchTVQuery,
  useSearchPeopleQuery,
  useSearchCollectionsQuery,
  useSearchCompaniesQuery,
  useSearchKeywordsQuery,
  useSearchTypeCountsQuery,
} from "@/features/search/hooks/queries";
import {
  SEARCH_CATEGORIES,
  type SearchCategory,
  type SearchDataset,
  type SearchCategoryItem,
} from "@/features/search/types";
export function useSearchController() {
  const searchParams = useSearchParams();
  const router = useClientQueryRouter();

  const rawQuery = (searchParams.get("q") || "").trim();
  const requestedType = searchParams.get("type") as SearchCategory;
  const typeParam = SEARCH_CATEGORIES.includes(requestedType)
    ? requestedType
    : "movies";
  const pageParam = searchParams.get("page");
  const currentPage = parsePage(pageParam);

  const [inputVal, setInputVal] = useState(rawQuery);

  useEffect(() => {
    setInputVal(rawQuery);
  }, [rawQuery]);

  // Support year filter shorthand (e.g., "spider man y:2002")
  const { cleanQuery, yearFilter } = useMemo(() => {
    const yearMatch = rawQuery.match(/\by:(\d{4})\b/i);
    if (yearMatch) {
      const year = yearMatch[1];
      const clean = rawQuery.replace(/\by:\d{4}\b/i, "").trim();
      return { cleanQuery: clean || rawQuery, yearFilter: year };
    }
    return { cleanQuery: rawQuery, yearFilter: null };
  }, [rawQuery]);

  // Live Counts for each Category
  const { data: counts } = useSearchTypeCountsQuery(cleanQuery);

  // Queries for each Category
  const isMovies = typeParam === "movies";
  const isTV = typeParam === "tv";
  const isPeople = typeParam === "people";
  const isCollections = typeParam === "collections";
  const isCompanies = typeParam === "companies";
  const isKeywords = typeParam === "keywords";

  const movieQuery = useSearchMoviesQuery(
    isMovies ? cleanQuery : "",
    currentPage,
  );
  const tvQuery = useSearchTVQuery(isTV ? cleanQuery : "", currentPage);
  const peopleQuery = useSearchPeopleQuery(
    isPeople ? cleanQuery : "",
    currentPage,
  );
  const collectionsQuery = useSearchCollectionsQuery(
    isCollections ? cleanQuery : "",
    currentPage,
  );
  const companiesQuery = useSearchCompaniesQuery(
    isCompanies ? cleanQuery : "",
    currentPage,
  );
  const keywordsQuery = useSearchKeywordsQuery(isKeywords ? cleanQuery : "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (trimmed) {
      router.push(
        `/search?q=${encodeURIComponent(trimmed)}&type=${typeParam}&page=1`,
      );
    }
  };

  const handleCategoryChange = (newCategory: SearchCategory) => {
    router.push(
      `/search?q=${encodeURIComponent(rawQuery)}&type=${newCategory}&page=1`,
    );
  };

  const handlePageChange = (newPage: number) => {
    router.push(
      `/search?q=${encodeURIComponent(rawQuery)}&type=${typeParam}&page=${newPage}`,
    );
  };

  const categories: SearchCategoryItem[] = [
    {
      id: "movies",
      label: "Movies",
      count: movieQuery.data?.total_results ?? counts?.movies ?? 0,
      icon: Film,
    },
    {
      id: "tv",
      label: "TV Shows",
      count: counts?.tv ?? tvQuery.data?.total_results ?? 0,
      icon: Tv,
    },
    {
      id: "people",
      label: "People",
      count: counts?.people ?? peopleQuery.data?.total_results ?? 0,
      icon: User,
    },
    {
      id: "collections",
      label: "Collections",
      count: counts?.collections ?? collectionsQuery.data?.total_results ?? 0,
      icon: Layers,
    },
    {
      id: "keywords",
      label: "Keywords",
      count: counts?.keywords ?? keywordsQuery.data?.total_results ?? 0,
      icon: Tag,
    },
    {
      id: "companies",
      label: "Companies",
      count: counts?.companies ?? companiesQuery.data?.total_results ?? 0,
      icon: Building,
    },
    {
      id: "networks",
      label: "Networks",
      count: 0,
      icon: Radio,
    },
    {
      id: "awards",
      label: "Awards",
      count: 0,
      icon: Trophy,
    },
  ];

  const activeQuery =
    typeParam === "movies"
      ? movieQuery
      : typeParam === "tv"
        ? tvQuery
        : typeParam === "people"
          ? peopleQuery
          : typeParam === "collections"
            ? collectionsQuery
            : typeParam === "companies"
              ? companiesQuery
              : typeParam === "keywords"
                ? keywordsQuery
                : null;
  let dataset: SearchDataset;
  switch (typeParam) {
    case "movies":
      dataset = {
        category: "movies",
        items: (movieQuery.data?.results || []).filter(
          (movie) => !yearFilter || movie.release_date?.startsWith(yearFilter),
        ),
      };
      break;
    case "tv":
      dataset = { category: "tv", items: tvQuery.data?.results || [] };
      break;
    case "people":
      dataset = { category: "people", items: peopleQuery.data?.results || [] };
      break;
    case "collections":
      dataset = {
        category: "collections",
        items: collectionsQuery.data?.results || [],
      };
      break;
    case "keywords":
      dataset = {
        category: "keywords",
        items: keywordsQuery.data?.results || [],
      };
      break;
    case "companies":
      dataset = {
        category: "companies",
        items: companiesQuery.data?.results || [],
      };
      break;
    default:
      dataset = { category: typeParam, items: [] };
  }
  return {
    rawQuery,
    typeParam,
    inputVal,
    setInputVal,
    router,
    handleSearchSubmit,
    handleCategoryChange,
    handlePageChange,
    categories,
    currentPage,
    totalPages:
      typeParam === "keywords"
        ? 1
        : Math.min(activeQuery?.data?.total_pages || 1, 500),
    isLoading: activeQuery?.isLoading || false,
    activeQuery,
    dataset,
  };
}
