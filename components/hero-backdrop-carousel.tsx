"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";

interface HeroBackdropCarouselProps {
  topMovie: Movie[];
}

const HeroBackdropCarousel: React.FC<HeroBackdropCarouselProps> = ({
  topMovie,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const movies = topMovie?.slice(0, 10) || [];

  useEffect(() => {
    if (movies.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [movies.length]);

  if (movies.length === 0) {
    return (
      <section className="lg:container">
        <div className="relative aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full overflow-hidden lg:rounded-xl border bg-secondary">
          <div className="absolute aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full flex items-end">
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
                Discover movies at the speed of light
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lg:container">
      <div className="relative aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full overflow-hidden lg:rounded-xl group">
        {/* Render all backdrop images absolutely positioned for seamless CSS crossfade */}
        {movies.map((movie, index) => {
          const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
          const isSelected = index === currentIndex;

          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isSelected
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={backdropUrl}
                alt={movie.title}
                fill
                priority={index === 0}
                className="object-cover brightness-[60%] group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </Link>
          );
        })}

        {/* Text Overlay matching original Swiftz design */}
        <div className="absolute aspect-[4/5] sm:aspect-[7/4] lg:aspect-[16/9] w-full flex items-end z-20 pointer-events-none">
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
              Discover movies at the speed of light
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBackdropCarousel;
