"use client";
import { useVisible } from "@/hooks/use-visible";
import { useTopRatedMoviesQuery } from "@/features/movies/hooks/queries";
import { usePopularTVShowsQuery } from "@/features/tv/hooks/queries";
import { usePopularPeopleQuery } from "@/features/people/hooks/queries";
import {
  type MediaItem,
  HomeMediaCarousel,
} from "@/features/home/components/home-media-carousel";
import { TrendingSection } from "@/features/home/components/trending-section";
import { BornTodayCarousel } from "@/features/home/components/born-today-carousel";
import { HomeShelfLoading } from "@/features/home/components/home-shelf-loading";
export function HomeSecondarySections() {
  const trending = useVisible();
  const topRated = useVisible();
  const television = useVisible();
  const people = useVisible();
  const moviesQuery = useTopRatedMoviesQuery(1, topRated.visible);
  const tvQuery = usePopularTVShowsQuery(1, television.visible);
  const peopleQuery = usePopularPeopleQuery(1, people.visible);
  const movieItems: MediaItem[] = (moviesQuery.data?.results || []).map(
    (item) => ({
      id: item.id,
      title: item.title,
      poster_path: item.poster_path,
      vote_average: item.vote_average,
      release_year: item.release_date?.substring(0, 4),
      media_type: "movie",
    }),
  );
  const tvItems: MediaItem[] = (tvQuery.data?.results || []).map((item) => ({
    id: item.id,
    title: item.name,
    poster_path: item.poster_path,
    vote_average: item.vote_average,
    release_year: item.first_air_date?.substring(0, 4),
    media_type: "tv",
  }));

  return (
    <div className="space-y-12">
      <div ref={trending.ref}>
        <TrendingSection enabled={trending.visible} />
      </div>
      <div ref={topRated.ref}>
        {moviesQuery.data ? (
          <HomeMediaCarousel
            title="Top Rated"
            items={movieItems}
            viewAllHref="/movie/top-rated"
          />
        ) : (
          <HomeShelfLoading
            title="Top Rated"
            action={{ label: "View all", href: "/movie/top-rated" }}
            isError={moviesQuery.isError}
            onRetry={() => void moviesQuery.refetch()}
          />
        )}
      </div>
      <div ref={television.ref}>
        {tvQuery.data ? (
          <HomeMediaCarousel
            title="Popular TV Series"
            items={tvItems}
            viewAllHref="/tv/popular"
          />
        ) : (
          <HomeShelfLoading
            title="Popular TV Series"
            action={{ label: "View all", href: "/tv/popular" }}
            isError={tvQuery.isError}
            onRetry={() => void tvQuery.refetch()}
          />
        )}
      </div>
      <div ref={people.ref}>
        {peopleQuery.data ? (
          <BornTodayCarousel people={peopleQuery.data.results} />
        ) : (
          <HomeShelfLoading
            title="Popular Stars"
            action={{ label: "Explore People", href: "/person" }}
            variant="person-shelf"
            isError={peopleQuery.isError}
            onRetry={() => void peopleQuery.refetch()}
          />
        )}
      </div>
    </div>
  );
}
