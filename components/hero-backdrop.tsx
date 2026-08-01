import React from "react";
import { getPopularMovies } from "@/lib/tmdb";
import HeroBackdropCarousel from "./hero-backdrop-carousel";

const HeroBackdrop = async () => {
  try {
    const popularMovies = await getPopularMovies(1);
    return <HeroBackdropCarousel topMovie={popularMovies.results} />;
  } catch (error) {
    return <HeroBackdropCarousel topMovie={[]} />;
  }
};

export default HeroBackdrop;
