import "server-only";
import type { getPersonDetails as PersonFetcher } from "@/features/people/api/server";
import { siteUrl } from "@/lib/seo";
import { tmdbImageUrl } from "@/lib/tmdb/images";
import { StructuredData } from "@/components/common/structured-data";
import { PersonOverview } from "@/features/people/components/person-overview";
import { PersonCreditsTimelineLoader } from "@/features/people/components/person-credits-timeline";

export function PersonDetail({
  person,
}: {
  person: Awaited<ReturnType<typeof PersonFetcher>>;
}) {
  return (
    <main className="container min-h-screen py-20">
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: person.name,
          description: person.biography,
          url: `${siteUrl}/person/${person.id}`,
          image: tmdbImageUrl(person.profile_path, 780),
          birthDate: person.birthday || undefined,
          deathDate: person.deathday || undefined,
          jobTitle: person.known_for_department,
        }}
      />
      <PersonOverview
        person={person}
        externalIds={person.external_ids}
        credits={person.combined_credits}
        timeline={
          <PersonCreditsTimelineLoader
            personId={person.id}
            primaryDepartment={person.known_for_department}
          />
        }
      />
    </main>
  );
}
