import { getPopularMovies } from "@/features/movies/api/server";
import { FeaturedHero } from "@/features/home/components/featured-hero";
import { PopularMoviesShelf } from "@/features/home/components/popular-movies-shelf";
import { GenresCard } from "@/features/movies/genres/genres-card";
import { HomeSecondarySections } from "@/features/home/components/home-secondary-sections";
import { pageMetadata, siteUrl } from "@/lib/seo";
import { StructuredData } from "@/components/common/structured-data";
export const metadata = pageMetadata({
  title: "Discover Movies, TV Shows & People",
  description:
    "Explore popular films, trending TV shows, trailers, cast, and recommendations. Find your next favorite and build your watchlist on Swiftz.",
  path: "/",
});

export const revalidate = 86400; // 24 hours ISR

export default async function HomePage() {
  // Only the above-the-fold hero/list is rendered and cached on the server.
  const popularMoviesData = await getPopularMovies(1);

  const popularMovies = popularMoviesData.results || [];
  const heroMovies = popularMovies.slice(0, 8);
  const remainingPopular = popularMovies.slice(8);

  return (
    <main className="space-y-12 pb-16">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Swiftz",
          url: siteUrl,
        }}
      />
      {/* 1. IMDb-style Featured Spotlight Banner with Trailer Dialog */}
      <FeaturedHero movies={heroMovies} />

      {/* 2. Rest of the Popular Movies Shelf */}
      {remainingPopular.length > 0 && (
        <div className="relative z-1">
          <PopularMoviesShelf movies={remainingPopular} />
        </div>
      )}

      <div className="relative z-1">
        <HomeSecondarySections />
      </div>

      {/* 7. Explore by Genres */}
      <div className="relative z-1">
        <GenresCard />
      </div>
    </main>
  );
}
