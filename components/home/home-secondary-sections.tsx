"use client";

import { useVisible } from "@/hooks/use-visible";
import { useTopRatedMoviesQuery, usePopularTVShowsQuery, usePopularPeopleQuery } from "@/hooks/use-tmdb";
import { HomeMediaCarousel, MediaItem } from "./home-media-carousel";
import { TrendingSection } from "./trending-section";
import { BornTodayCarousel } from "./born-today-carousel";
import { HomeShelfLoading } from "./home-shelf-loading";

export function HomeSecondarySections() {
  const trending = useVisible();
  const topRated = useVisible();
  const television = useVisible();
  const people = useVisible();
  const moviesQuery = useTopRatedMoviesQuery(1, topRated.visible);
  const tvQuery = usePopularTVShowsQuery(1, television.visible);
  const peopleQuery = usePopularPeopleQuery(1, people.visible);
  const movieItems: MediaItem[] = (moviesQuery.data?.results || []).map((item) => ({
    id: item.id, title: item.title, poster_path: item.poster_path, vote_average: item.vote_average,
    release_year: item.release_date?.substring(0, 4), media_type: "movie",
  }));
  const tvItems: MediaItem[] = (tvQuery.data?.results || []).map((item) => ({
    id: item.id, title: item.name, poster_path: item.poster_path, vote_average: item.vote_average,
    release_year: item.first_air_date?.substring(0, 4), media_type: "tv",
  }));

  return (
    <div className="space-y-12">
      <div ref={trending.ref}>
        {trending.visible ? <TrendingSection /> : <HomeShelfLoading title="Trending Today" />}
      </div>
      <div ref={topRated.ref}>
        {moviesQuery.data ? <HomeMediaCarousel title="Top Rated Across Cinema" items={movieItems} viewAllHref="/movie/top-rated" /> : <HomeShelfLoading title="Top Rated Across Cinema" isError={moviesQuery.isError} />}
      </div>
      <div ref={television.ref}>
        {tvQuery.data ? <HomeMediaCarousel title="Popular Television Series" items={tvItems} viewAllHref="/tv/popular" /> : <HomeShelfLoading title="Popular Television Series" isError={tvQuery.isError} />}
      </div>
      <div ref={people.ref}>
        {peopleQuery.data ? <BornTodayCarousel people={peopleQuery.data.results} /> : <HomeShelfLoading title="Popular Stars" isError={peopleQuery.isError} />}
      </div>
    </div>
  );
}
