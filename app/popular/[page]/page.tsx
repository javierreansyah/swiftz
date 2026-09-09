import { redirect } from "next/navigation";

interface PopularMoviesPageProps {
  params: Promise<{
    page: string;
  }>;
}

export default async function PopularMoviesPage({
  params,
}: PopularMoviesPageProps) {
  const { page } = await params;
  redirect(`/popular?page=${page || 1}`);
}
