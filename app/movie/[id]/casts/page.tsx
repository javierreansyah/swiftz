import type { Metadata } from "next";
import MovieCastPage from "./casts-client";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 604800;
export async function generateStaticParams() { return []; }

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({ title: "Movie Cast & Crew", description: "Explore the full cast and crew for this movie.", path: `/movie/${id}/casts`, noIndex: true });
}

export default function Page({ params }: Props) { return <MovieCastPage params={params} />; }
