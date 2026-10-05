import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPersonDetails } from "@/features/people/api/server";
import { isTMDBNotFound } from "@/lib/tmdb/error";
import { pageMetadata } from "@/lib/seo";
import { tmdbImageUrl } from "@/lib/tmdb/images";
import { PersonDetail } from "@/features/people/components/person-detail";
interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 604800; // 7 days ISR

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PersonDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const person = await getPersonDetails(id);
    return pageMetadata({
      title: `${person.name} — Biography & Filmography`,
      description:
        person.biography?.slice(0, 160) ||
        `Explore ${person.name}'s biography, movies, television credits, and career.`,
      path: `/person/${person.id}`,
      image: tmdbImageUrl(person.profile_path, 780),
    });
  } catch (error) {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  }
}

export default async function PersonDetailPage({
  params,
}: PersonDetailPageProps) {
  const { id } = await params;

  const person = await getPersonDetails(id).catch((error: unknown) => {
    if (isTMDBNotFound(error)) notFound();
    throw error;
  });
  return <PersonDetail key={person.id} person={person} />;
}
