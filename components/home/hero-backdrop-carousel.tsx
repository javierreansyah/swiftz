"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types";

export interface HeroBackdropCarouselProps {
  topMovie: Movie[];
}

export function HeroBackdropCarousel({ topMovie }: HeroBackdropCarouselProps) {
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
      <section className="mx-auto lg:container">
        <div className="relative aspect-4/5 w-full overflow-hidden border bg-secondary sm:aspect-7/4 lg:aspect-video lg:rounded-xl">
          <div className="absolute flex aspect-4/5 w-full items-end sm:aspect-7/4 lg:aspect-video">
            <div className="p-8">
              <h1
                className="text-6xl font-black sm:text-7xl"
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
    <section className="mx-auto lg:container">
      <div className="group relative aspect-4/5 w-full overflow-hidden sm:aspect-7/4 lg:aspect-video lg:rounded-xl">
        {/* Render all backdrop images absolutely positioned for seamless crossfade */}
        {movies.map((movie, index) => {
          const backdropUrl = `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`;
          const isSelected = index === currentIndex;

          return (
            <Link
              key={movie.id}
              href={`/movie/${movie.id}`}
              prefetch={false}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isSelected
                  ? "pointer-events-auto z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0"
              }`}
            >
              <Image
                src={backdropUrl}
                alt={movie.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover brightness-60 transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Link>
          );
        })}

        {/* Text Overlay matching original Swiftz design */}
        <div className="pointer-events-none absolute z-20 flex aspect-4/5 w-full items-end sm:aspect-7/4 lg:aspect-video">
          <div className="p-8">
            <h1
              className="text-6xl font-black text-white sm:text-7xl"
              style={{ fontStyle: "italic" }}
            >
              Swiftz
            </h1>
            <p
              className="pl-1 text-sm text-white sm:text-base"
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

export default HeroBackdropCarousel;
