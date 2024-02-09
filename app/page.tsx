import HeroBackdrop from "@/components/hero-backdrop";
import HomeInfoCard from "@/components/home-info-cards";
import GenresCard from "@/components/genres-card";

export default function Home() {
  return (
    <main>
      <HeroBackdrop />
      <HomeInfoCard />
      <GenresCard />
    </main>
  );
}
