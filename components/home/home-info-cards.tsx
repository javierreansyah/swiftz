import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeInfoCards() {
  const cardStyle =
    "flex h-107.5 w-full flex-col justify-between space-y-3 rounded-xl border bg-card p-6 sm:h-75 sm:p-8 lg:h-112.5";

  return (
    <section className="container grid grid-cols-1 gap-4 lg:grid-cols-2 xl:gap-12">
      <div className={cardStyle}>
        <div className="space-y-3">
          <h2 className="text-4xl font-extrabold text-primary">Discover</h2>
          <p className="font-light">
            Stuck in a rut and can&apos;t decide on your next movie night? Let Swiftz be
            your guide to endless entertainment! Explore the latest blockbusters,
            hottest trends, and hidden gems effortlessly. With Swiftz, movie night just
            got a whole lot more exciting!
          </p>
        </div>

        <Button asChild size="full">
          <Link href="/discover">Discover Now</Link>
        </Button>
      </div>

      <div className={cardStyle}>
        <div className="space-y-3">
          <h2 className="text-4xl font-extrabold text-primary">Detailed</h2>
          <p className="font-light">
            Dive into the cinematic universe with Swiftz&apos;s comprehensive movie info
            hub! Explore cast details, delve into genres, and even catch a sneak peek of
            trailers. With Swiftz, you&apos;re empowered to immerse yourself in the rich
            tapestry of every film&apos;s unique narrative and production.
          </p>
        </div>

        <Button asChild size="full">
          <Link href="/movie/1022796">Try It Now</Link>
        </Button>
      </div>
    </section>
  );
}

export default HomeInfoCards;
