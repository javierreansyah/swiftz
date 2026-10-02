import type { MetadataRoute } from "next";
import { getPopularMovies } from "@/features/movies/api/server";
import { getPopularTVShows } from "@/features/tv/api/server";
import { getPopularPeople } from "@/features/people/api/server";
import { siteUrl, isPreview } from "@/lib/seo";
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return [];
  const paths = [
    "/",
    "/movie",
    "/tv",
    "/person",
    "/movie/popular",
    "/movie/top-rated",
    "/movie/now-playing",
    "/movie/upcoming",
    "/movie/trending-today",
    "/tv/popular",
    "/tv/top-rated",
    "/tv/on-the-air",
    "/tv/airing-today",
    "/tv/trending-today",
  ];
  // Bounded discovery, not a catalog crawl. Each list shares the server's cached fetch.
  const [movies, shows, people] = await Promise.all([
    getPopularMovies(),
    getPopularTVShows(),
    getPopularPeople(),
  ]);
  const detailPaths = [
    ...movies.results.slice(0, 20).map((item) => `/movie/${item.id}`),
    ...shows.results.slice(0, 20).map((item) => `/tv/${item.id}`),
    ...people.results.slice(0, 20).map((item) => `/person/${item.id}`),
  ];
  return [...new Set([...paths, ...detailPaths])].map((path) => ({
    url: `${siteUrl}${path}`,
  }));
}
