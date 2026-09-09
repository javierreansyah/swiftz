import { redirect } from "next/navigation";

interface TrendingMoviesPageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function TrendingMoviesPage({
  params,
}: TrendingMoviesPageProps) {
  const { page } = await params;
  redirect(`/trending?page=${page || 1}`);
}
