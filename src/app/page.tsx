import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import Hero from "@/components/Hero";
import SponsorBanner from "@/components/SponsorBanner";
import LatestVideo from "@/components/LatestVideo";
import { fetchActiveSponsor } from "@/lib/queries/sponsors.server";
import { fetchUltimoVideoYouTube } from "@/lib/queries/youtube.server";
import { fetchApariencia } from "@/lib/queries/apariencia.server";
import { fetchUltimoProducto } from "@/lib/queries/productos.server";
import type { CSSProperties } from "react";

export default async function Home() {
  const [sponsor, video, apariencia, ultimoProducto] = await Promise.all([
    fetchActiveSponsor(),
    fetchUltimoVideoYouTube(),
    fetchApariencia(),
    fetchUltimoProducto(),
  ]);

  return (
    <main
      className="creator-home"
      style={
        {
          "--home-start": apariencia.fondo_inicio,
          "--home-end": apariencia.fondo_fin,
        } as CSSProperties
      }
    >
      <Hero portadaUrl={apariencia.portada_url} />
      <div className="creator-content">
        <SponsorBanner sponsor={sponsor} />
        {video && <LatestVideo key={video.id} video={video} />}
        <Link href="/productos" prefetch={false} className="creator-products">
          <span className="creator-products-copy">
            <strong>Mis productos</strong>
            <span>
              Ver todos los productos
              <ArrowRight size={17} aria-hidden="true" />
            </span>
          </span>
          <span className="creator-products-preview">
            {ultimoProducto?.imagen ? (
              <Image
                src={ultimoProducto.imagen}
                alt={`Último agregado: ${ultimoProducto.nombre.trim()}`}
                width={158}
                height={158}
                sizes="(max-width: 540px) 29vw, 158px"
              />
            ) : (
              <Package size={30} aria-hidden="true" />
            )}
          </span>
        </Link>
      </div>
    </main>
  );
}
