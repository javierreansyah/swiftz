import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { HomeInfoCards } from "@/components/home/home-info-cards";
import { GenresCard } from "@/components/genres/genres-card";

export const revalidate = 86400; // 24 hours ISR

export default function Home() {
  return (
    <main className="space-y-12 pt-20">
      <HeroBackdrop />
      <HomeInfoCards />
      <GenresCard />
    </main>
  );
}
