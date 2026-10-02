import TrendingMoviesPage from "./trending-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Trending Movies Today", description: "Discover the movies trending today, explore trailers and cast, and find what everyone is watching.", path: "/movie/trending-today" });

export default TrendingMoviesPage;
