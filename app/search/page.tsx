import SearchPage from "./search-client";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Search Movies, TV & People", description: "Search for movies, television series, people, and collections on Swiftz.", path: "/search", noIndex: true });

export default SearchPage;
