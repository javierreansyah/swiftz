import type { DiscoverMovieFilters } from "@/lib/tmdb/types/movie";
import type { DiscoverTVFilters } from "@/lib/tmdb/types/tv";
export const queryKeys = {
  searchCounts: (query: string) => ["search-counts", query] as const,
  movieAccountStates: (movieId: string | number, sessionId: string | null) =>
    ["movie-account-states", String(movieId), sessionId] as const,
  accountFavorites: (
    accountId: number | undefined,
    sessionId: string | null,
    page: number,
  ) => ["account-favorites", accountId, sessionId, page] as const,
  accountWatchlist: (
    accountId: number | undefined,
    sessionId: string | null,
    page: number,
  ) => ["account-watchlist", accountId, sessionId, page] as const,
  accountRated: (
    accountId: number | undefined,
    sessionId: string | null,
    page: number,
  ) => ["account-rated", accountId, sessionId, page] as const,
  tvAccountStates: (tvId: string | number, sessionId: string | null) =>
    ["tv-account-states", String(tvId), sessionId] as const,
  genresMovies: (genreQuery: string, page: number) =>
    ["genres-movies", genreQuery, page] as const,
  popularMovies: (page: number) => ["popular-movies", page] as const,
  trendingMovies: (page: number) => ["trending-movies", page] as const,
  nowPlayingMovies: (page: number) => ["now-playing-movies", page] as const,
  topRatedMovies: (page: number) => ["top-rated-movies", page] as const,
  upcomingMovies: (page: number) => ["upcoming-movies", page] as const,
  discoverMovies: (filters: DiscoverMovieFilters) =>
    ["discover-movies", filters] as const,
  watchProviders: (region: string) => ["watch-providers", region] as const,
  movieCast: (id: string) => ["movie-cast", id] as const,
  movieRecommendations: (id: string, page: number) =>
    ["movie-recommendations", id, page] as const,
  movieReviews: (movieId: string | number, page: number) =>
    ["movie-reviews", String(movieId), page] as const,
  movieVideos: (id: string | number) => ["movie-videos", String(id)] as const,
  movieImages: (id: string | number) => ["movie-images", String(id)] as const,
  movieCollection: (collectionId: string | number | null | undefined) =>
    ["movie-collection", String(collectionId)] as const,
  popularPeople: (page: number) => ["popular-people", page] as const,
  personDetails: (id: string | number) =>
    ["person-details", String(id)] as const,
  personCredits: (id: string | number) =>
    ["person-credits", String(id)] as const,
  personExternalIds: (id: string | number) =>
    ["person-external-ids", String(id)] as const,
  searchMovies: (query: string, page: number) =>
    ["search-movies", query, page] as const,
  searchKeywords: (query: string) => ["search-keywords", query] as const,
  searchMulti: (query: string, page: number) =>
    ["search-multi", query, page] as const,
  searchTv: (query: string, page: number) =>
    ["search-tv", query, page] as const,
  searchPeople: (query: string, page: number) =>
    ["search-people", query, page] as const,
  searchCollections: (query: string, page: number) =>
    ["search-collections", query, page] as const,
  searchCompanies: (query: string, page: number) =>
    ["search-companies", query, page] as const,
  popularTv: (page: number) => ["popular-tv", page] as const,
  trendingTv: (page: number) => ["trending-tv", page] as const,
  topRatedTv: (page: number) => ["top-rated-tv", page] as const,
  onTheAirTv: (page: number) => ["on-the-air-tv", page] as const,
  airingTodayTv: (page: number) => ["airing-today-tv", page] as const,
  discoverTv: (filters: DiscoverTVFilters) => ["discover-tv", filters] as const,
  tvDetails: (id: string | number) => ["tv-details", String(id)] as const,
  tvCredits: (id: string | number) => ["tv-credits", String(id)] as const,
  tvVideos: (id: string | number) => ["tv-videos", String(id)] as const,
  tvRecommendations: (id: string | number, page: number) =>
    ["tv-recommendations", String(id), page] as const,
  tvReviews: (tvId: string | number, page: number) =>
    ["tv-reviews", String(tvId), page] as const,
  tvSeasonDetails: (
    seriesId: string | number | undefined,
    seasonNumber: number | undefined,
  ) => ["tv-season-details", String(seriesId), seasonNumber] as const,
};
