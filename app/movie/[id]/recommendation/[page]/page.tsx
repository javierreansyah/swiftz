import { redirect } from "next/navigation";

interface MovieRecommendationPageProps {
  params: Promise<{
    id: string;
    page: string;
  }>;
}

export default async function MovieRecommendationPage({
  params,
}: MovieRecommendationPageProps) {
  const { id, page } = await params;
  redirect(`/movie/${id}/recommendation?page=${page || 1}`);
}
