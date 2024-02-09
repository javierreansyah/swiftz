import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Search } from "lucide-react";

const HomeInfoCard = () => {
  const cardStyle =
    "w-full h-[430px] sm:h-[300px] lg:h-[450px] bg-card rounded-xl border p-6 sm:p-8 space-y-3 flex flex-col justify-between";
  return (
    <div className="container lg:grid grid-cols-3 pt-12 lg:gap-12 space-y-8 lg:space-y-0">
      <div className={cardStyle}>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-primary">Discover</h1>
          <p className="font-light">
            {`Stuck in a rut and can't decide on your next movie night? Let Swiftz be your guide to endless entertainment! 
            Explore the latest blockbusters, hottest trends, and hidden gems effortlessly. With Swiftz, movie night just got a whole lot more exciting!`}
          </p>
        </div>

        <Button asChild size="full">
          <Link href={"/discover"}>Discover Now</Link>
        </Button>
      </div>
      <div className={cardStyle}>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-primary">Search</h1>

          <p className="font-light">
            {`Unlock a world of movies with Swiftz search! Effortlessly find your next favorite flick from a vast library. 
            Say goodbye to endless scrolling and hello to movie magic at your fingertips!`}
          </p>
        </div>

        <Button asChild size="full">
          <Link href={"/search"}>Search Now</Link>
        </Button>
      </div>
      <div className={cardStyle}>
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-primary">Detailed</h1>
          <p className="font-light">
            {`Dive into the cinematic universe with Swiftz's comprehensive movie info hub! Explore cast details, delve into genres, and even catch a sneak peek of trailers. 
            With Swiftz, you're empowered to immerse yourself in the rich tapestry of every film's unique narrative and production.`}
          </p>
        </div>

        <Button asChild size="full">
          <Link href={"/movie/1022796"}>Try It Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default HomeInfoCard;
