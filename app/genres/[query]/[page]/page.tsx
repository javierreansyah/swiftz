import { redirect } from "next/navigation";

interface GenreQueryPageProps {
  params: Promise<{
    query: string;
    page: string;
  }>;
}

export default async function GenreQueryPage({ params }: GenreQueryPageProps) {
  const { query, page } = await params;
  redirect(`/genres?with=${encodeURIComponent(query)}&page=${page || 1}`);
}
