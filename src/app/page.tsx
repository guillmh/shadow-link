import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import SponsorBanner from "@/components/SponsorBanner";

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto">
      <Hero />
      <SponsorBanner />
      <ProductGrid />
    </main>
  );
}
