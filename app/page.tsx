import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTVShows,
  getPopularTVShows,
  getPopularPeople,
} from "@/lib/tmdb";
import {
  FeaturedHero,
  PopularMoviesShelf,
  TrendingSection,
  HomeMediaCarousel,
  BornTodayCarousel,
  MediaItem,
} from "@/components/home";
import { GenresCard } from "@/components/genres/genres-card";

export const revalidate = 86400; // 24 hours ISR

export default async function Home() {
  // Concurrently fetch all Home data
  const [
    popularMoviesData,
    trendingMoviesData,
    trendingTVData,
    topRatedMoviesData,
    popularTVData,
    popularPeopleData,
  ] = await Promise.all([
    getPopularMovies(1).catch(() => ({ results: [] })),
    getTrendingMovies(1).catch(() => ({ results: [] })),
    getTrendingTVShows(1).catch(() => ({ results: [] })),
    getTopRatedMovies(1).catch(() => ({ results: [] })),
    getPopularTVShows(1).catch(() => ({ results: [] })),
    getPopularPeople(1).catch(() => ({ results: [] })),
  ]);

  const popularMovies = popularMoviesData.results || [];
  const heroMovies = popularMovies.slice(0, 8);
  const remainingPopular = popularMovies.slice(8);

  const topRatedItems: MediaItem[] = (topRatedMoviesData.results || []).map(
    (m) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path,
      vote_average: m.vote_average,
      release_year: m.release_date ? m.release_date.substring(0, 4) : undefined,
      media_type: "movie",
    })
  );

  const popularTVItems: MediaItem[] = (popularTVData.results || []).map(
    (t) => ({
      id: t.id,
      title: t.name,
      poster_path: t.poster_path,
      vote_average: t.vote_average,
      release_year: t.first_air_date ? t.first_air_date.substring(0, 4) : undefined,
      media_type: "tv",
    })
  );

  return (
    <main className="space-y-12 py-16">
      {/* 1. IMDb-style Featured Spotlight Banner with Trailer Dialog */}
      <FeaturedHero movies={heroMovies} />

      {/* 2. Rest of the Popular Movies Shelf */}
      {remainingPopular.length > 0 && (
        <PopularMoviesShelf movies={remainingPopular} />
      )}

      {/* 3. Trending Today Section (Movies & TV Shows Toggle) */}
      <TrendingSection
        movies={trendingMoviesData.results || []}
        tvShows={trendingTVData.results || []}
      />

      {/* 4. Top Rated Across Cinema */}
      <HomeMediaCarousel
        title="Top Rated Across Cinema"
        subtitle="Masterpieces celebrated by critics and fans alike"
        items={topRatedItems}
        viewAllHref="/movie"
      />

      {/* 5. Popular Television Series */}
      <HomeMediaCarousel
        title="Popular Television Series"
        subtitle="Binge-worthy shows streaming across global networks"
        items={popularTVItems}
        viewAllHref="/tv"
      />

      {/* 6. Born Today & Popular Stars */}
      <BornTodayCarousel people={popularPeopleData.results || []} />

      {/* 7. Explore by Genres */}
      <GenresCard />
    </main>
  );
}
