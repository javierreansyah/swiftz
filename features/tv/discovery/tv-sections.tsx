"use client";
import { useVisible } from "@/hooks/use-visible";
import { MediaCarouselRow } from "@/features/media/components/media-carousel-row";
import {
  usePopularTVShowsQuery,
  useTopRatedTVShowsQuery,
  useOnTheAirTVShowsQuery,
  useTrendingTVShowsQuery,
  useAiringTodayTVShowsQuery,
} from "@/features/tv/hooks/queries";
export interface TVSectionsProps {
  onSelectGenre?: (genreId: string) => void;
  onSelectSort?: (sort: string) => void;
}

export function TVSections() {
  const popular = useVisible();
  const topRated = useVisible();
  const onTheAir = useVisible();
  const airingToday = useVisible();
  const { data: trendingData, isLoading: isTrendingLoading } =
    useTrendingTVShowsQuery(1);
  const { data: popularData, isLoading: isPopularLoading } =
    usePopularTVShowsQuery(1, popular.visible);
  const { data: topRatedData, isLoading: isTopRatedLoading } =
    useTopRatedTVShowsQuery(1, topRated.visible);
  const { data: onTheAirData, isLoading: isOnTheAirLoading } =
    useOnTheAirTVShowsQuery(1, onTheAir.visible);
  const { data: airingTodayData, isLoading: isAiringTodayLoading } =
    useAiringTodayTVShowsQuery(1, airingToday.visible);

  return (
    <div className="space-y-12">
      <MediaCarouselRow
        title="Trending TV Shows"
        items={trendingData?.results}
        isLoading={isTrendingLoading}
        viewAllHref="/tv/trending-today"
        type="tv"
      />
      <div ref={popular.ref}>
        <MediaCarouselRow
          title="Most Popular Shows"
          items={popularData?.results}
          isLoading={!popular.visible || isPopularLoading}
          viewAllHref="/tv/popular"
          type="tv"
        />
      </div>
      <div ref={topRated.ref}>
        <MediaCarouselRow
          title="Top Rated Television"
          items={topRatedData?.results}
          isLoading={!topRated.visible || isTopRatedLoading}
          viewAllHref="/tv/top-rated"
          type="tv"
        />
      </div>
      <div ref={onTheAir.ref}>
        <MediaCarouselRow
          title="Currently Airing"
          items={onTheAirData?.results}
          isLoading={!onTheAir.visible || isOnTheAirLoading}
          viewAllHref="/tv/on-the-air"
          type="tv"
        />
      </div>
      <div ref={airingToday.ref}>
        <MediaCarouselRow
          title="Airing Today"
          items={airingTodayData?.results}
          isLoading={!airingToday.visible || isAiringTodayLoading}
          viewAllHref="/tv/airing-today"
          type="tv"
        />
      </div>
    </div>
  );
}
