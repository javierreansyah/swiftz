import { redirect } from "next/navigation";

export default function TrendingLegacyRedirect() {
  redirect("/movie/trending-today");
}
