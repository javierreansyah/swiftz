"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryFeedback } from "@/features/media/components/query-feedback";
import {
  usePersonCombinedCreditsQuery,
  usePersonDetailsQuery,
  usePersonExternalIdsQuery,
} from "@/features/people/hooks/queries";
import { PersonOverview } from "@/features/people/components/person-overview";
import { PersonCreditsTimeline } from "@/features/people/components/person-credits-timeline";

export interface PersonDetailContentProps {
  personId: number | null;
  enabled?: boolean;
  onNavigate?: () => void;
}

function PersonDetailSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12"
      aria-busy="true"
    >
      <div className="space-y-6 lg:col-span-4 xl:col-span-3">
        <Skeleton className="aspect-2/3 w-full max-w-xs sm:max-w-sm lg:max-w-none" />
        <div className="space-y-4 rounded-3xl bg-card p-5 shadow-md">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="space-y-8 lg:col-span-8 xl:col-span-9">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export function PersonDetailContent({
  personId,
  enabled = true,
  onNavigate,
}: PersonDetailContentProps) {
  const detailsQuery = usePersonDetailsQuery(
    personId ?? 0,
    enabled && personId !== null,
  );
  const creditsQuery = usePersonCombinedCreditsQuery(
    personId ?? 0,
    enabled && personId !== null,
  );
  const externalIdsQuery = usePersonExternalIdsQuery(
    personId ?? 0,
    enabled && personId !== null,
  );

  const person = detailsQuery.data ?? null;
  const credits = creditsQuery.data ?? null;

  const detailsFailed = detailsQuery.isError && !detailsQuery.data;
  const creditsFailed =
    !detailsFailed &&
    person !== null &&
    creditsQuery.isError &&
    !creditsQuery.data;

  if (detailsFailed) {
    return (
      <QueryFeedback
        hasData={false}
        onRetry={() => void detailsQuery.refetch()}
      />
    );
  }

  if (creditsFailed) {
    return (
      <QueryFeedback
        hasData={false}
        onRetry={() => void creditsQuery.refetch()}
      />
    );
  }

  if (person === null || credits === null) {
    return <PersonDetailSkeleton />;
  }

  return (
    <PersonOverview
      key={person.id}
      person={person}
      externalIds={externalIdsQuery.data ?? { id: person.id }}
      credits={credits}
      onNavigate={onNavigate}
      timeline={
        <PersonCreditsTimeline
          key={person.id}
          credits={credits}
          primaryDepartment={person.known_for_department}
        />
      }
    />
  );
}
