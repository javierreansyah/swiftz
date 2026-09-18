import { redirect } from "next/navigation";

interface SearchQueryPageProps {
  params: Promise<{
    query: string;
  }>;
}

export default async function SearchQueryPage({ params }: SearchQueryPageProps) {
  const { query } = await params;
  redirect(`/search?q=${encodeURIComponent(query)}`);
}
