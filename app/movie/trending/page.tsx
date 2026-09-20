import { redirect } from "next/navigation";

export default function MovieTrendingRedirectPage() {
  redirect("/movie/trending-today");
}
