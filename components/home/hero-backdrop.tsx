import React from "react";
import { getPopularMovies } from "@/lib/tmdb";
import { HeroBackdropCarousel } from "./hero-backdrop-carousel";

export async function HeroBackdrop() {
  try {
    const popularMovies = await getPopularMovies(1);
    return <HeroBackdropCarousel topMovie={popularMovies.results} />;
  } catch {
    return <HeroBackdropCarousel topMovie={[]} />;
  }
}

export default HeroBackdrop;
