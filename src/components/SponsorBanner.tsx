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
      className="block mx-4 my-4 bg-accent hover:bg-accent/90 transition-colors group"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-12 h-12 shrink-0 bg-white/15 border border-white/20">
          <Image
            src={sponsor.logo}
            alt={sponsor.marca}
            fill
            sizes="48px"
            className="object-contain p-1.5"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/70">
            [ Sponsor ]
          </span>
          <p className="font-body text-sm text-white font-medium truncate">
            {sponsor.marca}
          </p>
          {sponsor.descripcion && (
            <p className="font-body text-xs text-white/80 truncate">
              {sponsor.descripcion}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
