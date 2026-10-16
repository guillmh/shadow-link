import Image from "next/image";
import { Sponsor } from "@/types/sponsor";

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
      className="group flex mx-4 my-4 glass card-interactive rounded-lg overflow-hidden hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="w-1 shrink-0 bg-gradient-to-b from-accent to-[#7c5cf0]" />
      <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 shrink-0 thumb">
          <Image
            src={sponsor.logo}
            alt={sponsor.marca}
            fill
            sizes="48px"
            className="object-contain p-1.5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="label-mono label-accent">
            [ Patrocinado ]
          </span>
          <p className="font-body text-sm text-ink font-semibold truncate">
            {sponsor.marca}
          </p>
          {sponsor.descripcion && (
            <p className="font-body text-xs text-muted truncate">
              {sponsor.descripcion}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
