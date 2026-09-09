import { redirect } from "next/navigation";

interface SearchQueryPageProps {
  params: Promise<{
    query: string;
    page: string;
  }>;
}

export default async function SearchQueryPage({ params }: SearchQueryPageProps) {
  const { query, page } = await params;
  redirect(`/search?q=${encodeURIComponent(query)}&page=${page || 1}`);
}
