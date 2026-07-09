import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import SponsorBanner from "@/components/SponsorBanner";
import LatestVideo from "@/components/LatestVideo";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <Hero />
      <SponsorBanner />
      <ProductGrid />
      <LatestVideo />
    </main>
  );
}
