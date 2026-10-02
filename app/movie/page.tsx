import MoviePage from "./movie-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Discover Movies", description: "Explore popular, trending, upcoming, and top-rated movies. Filter by genre, release year, rating, and streaming provider.", path: "/movie" });

export default MoviePage;
