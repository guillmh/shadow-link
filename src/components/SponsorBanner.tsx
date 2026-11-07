import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Sponsor } from "@/types/sponsor";

export default function SponsorBanner({
  sponsor,
}: {
  sponsor: Sponsor | null;
}) {
  if (!sponsor) return null;

  return (
    <a
      href={sponsor.link}
      target="_blank"
      rel="noopener noreferrer"
      className="creator-sponsor"
    >
      <span className="creator-sponsor-logo">
        <Image
          src={sponsor.logo}
          alt=""
          width={52}
          height={52}
          className="object-contain"
        />
      </span>
      <span className="min-w-0 flex-1">
        <small>Colaboración patrocinada</small>
        <strong>{sponsor.marca}</strong>
        {sponsor.descripcion && (
          <span className="creator-sponsor-description">
            {sponsor.descripcion}
          </span>
        )}
      </span>
      <ArrowUpRight size={18} aria-hidden="true" className="shrink-0" />
      <span className="sr-only">Abre en otra pestaña</span>
    </a>
  );
}
