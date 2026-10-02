import { getPopularMovies } from "@/lib/tmdb";
import {
  FeaturedHero,
  PopularMoviesShelf,
} from "@/components/home";
import { GenresCard } from "@/components/genres/genres-card";
import { HomeSecondarySections } from "@/components/home/home-secondary-sections";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { StructuredData } from "@/components/common/structured-data";

export const metadata = pageMetadata({ title: "Discover Movies, TV Shows & People", description: "Explore popular films, trending TV shows, trailers, cast, and recommendations. Find your next favorite and build your watchlist on Swiftz.", path: "/" });

export const revalidate = 86400; // 24 hours ISR

export default async function Home() {
  // Only the above-the-fold hero/list is rendered and cached on the server.
  const popularMoviesData = await getPopularMovies(1);

  const popularMovies = popularMoviesData.results || [];
  const heroMovies = popularMovies.slice(0, 8);
  const remainingPopular = popularMovies.slice(8);

  return (
    <main className="space-y-12 pb-16">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "WebSite", name: "Swiftz", url: siteUrl }} />
      {/* 1. IMDb-style Featured Spotlight Banner with Trailer Dialog */}
      <FeaturedHero movies={heroMovies} />

      {/* 2. Rest of the Popular Movies Shelf */}
      {remainingPopular.length > 0 && (
        <PopularMoviesShelf movies={remainingPopular} />
      )}

      <HomeSecondarySections />

      {/* 7. Explore by Genres */}
      <GenresCard />
    </main>
  );
}
