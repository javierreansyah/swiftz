import { redirect } from "next/navigation";

export default function PopularLegacyRedirect() {
  redirect("/movie/popular");
}
