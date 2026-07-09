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
      className="block mx-4 my-4 rounded-xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 text-white"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="relative w-14 h-14 shrink-0 bg-white rounded-lg p-2">
          <Image
            src={sponsor.logo}
            alt={sponsor.marca}
            fill
            className="object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wide text-gray-300">
            Patrocinado
          </p>
          <p className="font-semibold truncate">{sponsor.marca}</p>
          {sponsor.descripcion && (
            <p className="text-sm text-gray-300 truncate">
              {sponsor.descripcion}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
