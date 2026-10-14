import type { ReactNode } from "react";
import Image from "@/components/ui/image";
import { User } from "lucide-react";
import type {
  PersonCastCredit,
  PersonCombinedCredits,
  PersonDetailsData,
  PersonExternalIds,
} from "@/lib/tmdb/types/people";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/features/media/components/media-card";
import { PersonBio } from "@/features/people/components/person-bio";
import { PersonSocialLinks } from "@/features/people/components/person-social-links";

export function getKnownForList(
  credits: PersonCombinedCredits,
): PersonCastCredit[] {
  const seenMedia = new Set<string>();
  return [...(credits.cast || [])]
    .filter((c) => Boolean(c.poster_path))
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .filter((c) => {
      const key = `${c.media_type || "movie"}-${c.id}`;
      if (seenMedia.has(key)) return false;
      seenMedia.add(key);
      return true;
    })
    .slice(0, 8);
}

function formatBirthDate(birthDate: string, deathDate?: string | null): string {
  try {
    const d = new Date(birthDate);
    const formatted = d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const start = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - start.getFullYear();
    const m = end.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) {
      age--;
    }

    if (deathDate) {
      return `${formatted} (died at ${age})`;
    }
    return `${formatted} (${age} years old)`;
  } catch {
    return birthDate;
  }
}

function getGenderLabel(gender: number): string {
  switch (gender) {
    case 1:
      return "Female";
    case 2:
      return "Male";
    case 3:
      return "Non-binary";
    default:
      return "Not specified";
  }
}

export interface PersonOverviewProps {
  person: PersonDetailsData;
  externalIds: PersonExternalIds;
  credits: PersonCombinedCredits;
  timeline: ReactNode;
  onNavigate?: () => void;
}

export function PersonOverview({
  person,
  externalIds,
  credits,
  timeline,
  onNavigate,
}: PersonOverviewProps) {
  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : null;

  const totalCredits =
    (credits.cast?.length || 0) + (credits.crew?.length || 0);

  const knownForList = getKnownForList(credits);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Left Column (Desktop 4 cols): Portrait, Socials, Personal Info */}
      <div className="space-y-6 lg:col-span-4 xl:col-span-3">
        {/* Portrait Photo */}
        <div className="relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-xl bg-muted shadow-md sm:max-w-sm lg:max-w-none">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              sizes="(max-width: 1024px) 320px, 360px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-secondary text-muted-foreground">
              <User className="size-20" />
            </div>
          )}
        </div>

        {/* Social Links Row */}
        <PersonSocialLinks person={person} externalIds={externalIds} />

        {/* Personal Info Card */}
        <div className="space-y-4 rounded-3xl bg-card p-5 shadow-md">
          <h2 className="heading-section text-foreground">Personal Info</h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="block font-bold text-muted-foreground">
                Known For
              </span>
              <span className="font-semibold text-foreground">
                {person.known_for_department || "Acting"}
              </span>
            </div>

            <div>
              <span className="block font-bold text-muted-foreground">
                Known Credits
              </span>
              <span className="font-semibold text-foreground">
                {totalCredits}
              </span>
            </div>

            <div>
              <span className="block font-bold text-muted-foreground">
                Gender
              </span>
              <span className="font-semibold text-foreground">
                {getGenderLabel(person.gender)}
              </span>
            </div>

            {person.birthday && (
              <div>
                <span className="block font-bold text-muted-foreground">
                  Birthday
                </span>
                <span className="font-semibold text-foreground">
                  {formatBirthDate(person.birthday, person.deathday)}
                </span>
              </div>
            )}

            {person.deathday && (
              <div>
                <span className="block font-bold text-muted-foreground">
                  Day of Death
                </span>
                <span className="font-semibold text-foreground">
                  {formatBirthDate(person.deathday)}
                </span>
              </div>
            )}

            {person.place_of_birth && (
              <div>
                <span className="block font-bold text-muted-foreground">
                  Place of Birth
                </span>
                <span className="font-semibold text-foreground">
                  {person.place_of_birth}
                </span>
              </div>
            )}

            {person.also_known_as && person.also_known_as.length > 0 && (
              <div>
                <span className="block font-bold text-muted-foreground">
                  Also Known As
                </span>
                <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {person.also_known_as.slice(0, 5).map((aka, i) => (
                    <p key={i}>{aka}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column (Desktop 8 cols): Name, Bio, Known For, Career Timeline */}
      <div className="space-y-8 lg:col-span-8 xl:col-span-9">
        {/* Header Name */}
        <div>
          <h1 className="heading-hero text-foreground">{person.name}</h1>
          <p className="mt-1 text-sm font-semibold text-primary">
            {person.known_for_department || "Actor"}
          </p>
        </div>

        {/* Biography */}
        <PersonBio biography={person.biography} />

        {/* Known For Shelf */}
        {knownForList.length > 0 && (
          <ContentCarousel title="Known For">
            {knownForList.map((item, idx) => {
              const href =
                item.media_type === "tv"
                  ? `/tv/${item.id}`
                  : `/movie/${item.id}`;

              return (
                <MediaCard
                  key={`${item.media_type || "media"}-${item.id}-${idx}`}
                  type={item.media_type === "tv" ? "tv" : "movie"}
                  id={item.id}
                  title={item.title || item.name || ""}
                  subtitle={item.character ? `as ${item.character}` : "Cast"}
                  image={item.poster_path}
                  rating={item.vote_average}
                  href={href}
                  onClick={onNavigate}
                  variant="shelf"
                />
              );
            })}
          </ContentCarousel>
        )}

        {/* Career Credits Timeline (provided by the host surface) */}
        {timeline}
      </div>
    </div>
  );
}
