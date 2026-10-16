import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import SponsorBanner from "@/components/SponsorBanner";
import LatestVideo from "@/components/LatestVideo";
import { fetchProductosServer } from "@/lib/queries/productos.server";
import { fetchActiveSponsor } from "@/lib/queries/sponsors.server";
import { fetchUltimoVideoUrl } from "@/lib/queries/configuracion.server";

export default async function Home() {
  const [productos, sponsor, videoUrl] = await Promise.all([
    fetchProductosServer(),
    fetchActiveSponsor(),
    fetchUltimoVideoUrl(),
  ]);

  return (
    <main className="max-w-2xl mx-auto">
      <Hero />
      <SponsorBanner sponsor={sponsor} />
      <ProductGrid productos={productos} />
      <LatestVideo videoUrl={videoUrl} />
    </main>
  );
}
