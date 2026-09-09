import HeroBackdrop from "@/components/hero-backdrop";
import HomeInfoCard from "@/components/home-info-cards";
import GenresCard from "@/components/genres-card";
export const revalidate = 86400; // 24 hours ISR

export default function Home() {
  return (
    <main className="space-y-12 pt-20">
      <HeroBackdrop />
      <HomeInfoCard />
      <GenresCard />
    </main>
  );
}
