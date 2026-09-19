import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Star,
  ExternalLink,
} from "lucide-react";
import {
  getPersonDetails,
  getPersonCombinedCredits,
  getPersonExternalIds,
} from "@/lib/tmdb";
import { PersonBio } from "./person-bio";
import { PersonCreditsTimeline } from "./person-credits-timeline";
import { PersonCombinedCredits, PersonExternalIds } from "@/types";
import { ContentCarousel } from "@/components/common/content-carousel";
import { MediaCard } from "@/components/common/media-card";

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface PersonDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 604800; // 7 days ISR

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

export default async function PersonDetailPage({
  params,
}: PersonDetailPageProps) {
  const { id } = await params;

  let person;
  let credits: PersonCombinedCredits;
  let externalIds: PersonExternalIds;

  try {
    [person, credits, externalIds] = await Promise.all([
      getPersonDetails(id),
      getPersonCombinedCredits(id).catch(
        () => ({ id: Number(id), cast: [], crew: [] } as PersonCombinedCredits)
      ),
      getPersonExternalIds(id).catch(
        () => ({ id: Number(id) } as PersonExternalIds)
      ),
    ]);
  } catch {
    notFound();
  }

  if (!person || !person.id) {
    notFound();
  }

  const profileUrl = person.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : null;

  const totalCredits = (credits.cast?.length || 0) + (credits.crew?.length || 0);

  // Determine top "Known For" items based on popularity
  const knownForList = [...(credits.cast || [])]
    .filter((c) => c.poster_path)
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 8);

  return (
    <main className="container min-h-screen py-20">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column (Desktop 4 cols): Portrait, Socials, Personal Info */}
        <div className="space-y-6 lg:col-span-4 xl:col-span-3">
          {/* Portrait Photo */}
          <div className="relative aspect-2/3 w-full max-w-xs overflow-hidden rounded-none border border-border bg-muted shadow-md sm:max-w-sm lg:max-w-none">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={person.name}
                fill
                priority
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
          <div className="flex items-center gap-3">
            {externalIds.twitter_id && (
              <a
                href={`https://x.com/${externalIds.twitter_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-none border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="X / Twitter"
              >
                <XIcon className="size-4" />
              </a>
            )}

            {externalIds.instagram_id && (
              <a
                href={`https://instagram.com/${externalIds.instagram_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-none border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}

            {externalIds.facebook_id && (
              <a
                href={`https://facebook.com/${externalIds.facebook_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-none border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Facebook"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}

            {(person.imdb_id || externalIds.imdb_id) && (
              <a
                href={`https://www.imdb.com/name/${person.imdb_id || externalIds.imdb_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 items-center justify-center rounded-none border border-border bg-card px-2.5 text-xs font-black text-primary transition-colors hover:border-primary"
                aria-label="IMDb"
              >
                IMDb
              </a>
            )}

            {person.homepage && (
              <a
                href={person.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-none border border-border bg-card text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label="Website"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>

          {/* Personal Info Card */}
          <div className="space-y-4 rounded-none border border-border bg-card p-5">
            <h2 className="text-base font-bold text-foreground">Personal Info</h2>

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
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {person.name}
            </h1>
            <p className="mt-1 text-sm font-semibold text-primary">
              {person.known_for_department || "Actor"}
            </p>
          </div>

          {/* Biography */}
          <PersonBio biography={person.biography} />

          {/* Known For Shelf */}
          {knownForList.length > 0 && (
            <ContentCarousel title="Known For">
              {knownForList.map((item) => {
                const href =
                  item.media_type === "tv"
                    ? `/tv/${item.id}`
                    : `/movie/${item.id}`;

                return (
                  <MediaCard
                    key={`${item.media_type}-${item.id}`}
                    type={item.media_type === "tv" ? "tv" : "movie"}
                    id={item.id}
                    title={item.title || item.name || ""}
                    subtitle={item.character ? `as ${item.character}` : "Cast"}
                    image={item.poster_path}
                    rating={item.vote_average}
                    href={href}
                    variant="shelf"
                  />
                );
              })}
            </ContentCarousel>
          )}

          {/* Searchable Career Credits Timeline */}
          <PersonCreditsTimeline
            credits={credits}
            primaryDepartment={person.known_for_department}
          />
        </div>
      </div>
    </main>
  );
}
