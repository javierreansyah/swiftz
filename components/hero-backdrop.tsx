"use client";

import { useState, useEffect } from "react";
import usePopularMovies from "@/hooks/use-popular-movies";
import Image from "next/image";

const HeroBackdrop = () => {
  const { popularMovies, isLoading, error } = usePopularMovies(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const topMovie = popularMovies?.results;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % (topMovie?.length ?? 0)
        );
        setTransitioning(false);
      }, 300);
    }, 20000);
    return () => clearInterval(intervalId);
  }, [topMovie?.length]);

  if (isLoading || !popularMovies || !topMovie || error) {
    return (
      <div className="lg:container">
        <div className="relative aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full overflow-hidden lg:rounded-xl border bg-secondary">
          <div className="absolute aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full flex items-end">
            <div className="">
              <div className="p-8">
                <h1
                  className="font-black text-6xl sm:text-7xl"
                  style={{ fontStyle: "italic" }}
                >
                  Swiftz
                </h1>
                <p
                  className="pl-1 text-sm sm:text-base"
                  style={{ fontStyle: "italic" }}
                >
                  Discover movies at the speed of Taylor Swift
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentMovie = topMovie[currentIndex];
  const backdropUrl = `https://image.tmdb.org/t/p/w1280${currentMovie.backdrop_path}`;

  return (
    <div className="lg:container">
      <div className="relative aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full overflow-hidden lg:rounded-xl">
        <div className="">
          {transitioning && (
            <div className="absolute bg-card transition-opacity duration-500 opacity-100"></div>
          )}
          <Image
            src={backdropUrl}
            alt={currentMovie.title}
            layout="fill"
            objectFit="cover"
            className={`transition-opacity duration-500 brightness-[60%] ${
              transitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="absolute aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full flex items-end">
          <div className="">
            <div className="p-8">
              <h1
                className="font-black text-white text-6xl sm:text-7xl"
                style={{ fontStyle: "italic" }}
              >
                Swiftz
              </h1>
              <p
                className="pl-1 text-white text-sm sm:text-base"
                style={{ fontStyle: "italic" }}
              >
                Discover movies at the speed of Taylor Swift
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBackdrop;
