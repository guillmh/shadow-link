"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Sponsor } from "@/types/sponsor";

export default function SponsorBanner() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    async function fetchSponsor() {
      const ahora = new Date().toISOString();

      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .lte("fecha_inicio", ahora)
        .gte("fecha_fin", ahora)
        .order("fecha_inicio", { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setSponsor(data as Sponsor);
      }
    }

    fetchSponsor();
  }, []);

  if (!sponsor) return null;

  return (
    <a
      href={sponsor.link}
      target="_blank"
      rel="noopener noreferrer"
      className="flex mx-4 my-4 border border-hairline hover:border-ink transition-colors group"
    >
      <div className="w-1 bg-accent shrink-0" />
      <div className="flex items-center gap-4 p-4 flex-1 min-w-0">
        <div className="relative w-12 h-12 shrink-0 border border-hairline bg-surface">
          <Image
            src={sponsor.logo}
            alt={sponsor.marca}
            fill
            sizes="48px"
            className="object-contain p-1.5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
            [ Patrocinado ]
          </span>
          <p className="font-body text-sm text-ink font-medium truncate">
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
