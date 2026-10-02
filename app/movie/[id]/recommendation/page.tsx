import type { Metadata } from "next";
import RecommendationPage from "./recommendation-client";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 604800;
export async function generateStaticParams() { return []; }

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return pageMetadata({ title: "Movie Recommendations", description: "Find related movies and personalized viewing inspiration.", path: `/movie/${id}/recommendation`, noIndex: true });
}

export default function Page({ params }: Props) { return <RecommendationPage params={params} />; }
