import type { Metadata } from "next";
import { MovieCastClient } from "@/features/movies/detail/casts/movie-cast-client";
import { pageMetadata } from "@/lib/seo";
export const revalidate = 604800;
export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({
    title: "Movie Cast & Crew",
    description: "Explore the full cast and crew for this movie.",
    path: `/movie/${id}/casts`,
    noIndex: true,
  });
}

export default async function MovieCastPage({ params }: Props) {
  const { id } = await params;
  return <MovieCastClient id={id} />;
}
