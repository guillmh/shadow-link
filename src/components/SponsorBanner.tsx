"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Sponsor } from "@/types/sponsor";
import Skeleton from "./Skeleton";

export default function SponsorBanner() {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSponsor() {
      try {
        const ahora = new Date().toISOString();

        const { data, error } = await supabase
          .from("sponsors")
          .select("*")
          .lte("fecha_inicio", ahora)
          .gte("fecha_fin", ahora)
          .order("fecha_inicio", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          setSponsor(data as Sponsor);
        }
      } catch (err) {
        console.error("Error cargando sponsor:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSponsor();
  }, []);

  if (loading) {
    return (
      <div className="flex mx-4 my-4 border border-hairline">
        <Skeleton className="w-1 shrink-0" />
        <div className="flex items-center gap-4 p-4 flex-1">
          <Skeleton className="w-12 h-12 shrink-0" />
          <div className="flex-1 flex flex-col gap-1.5">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </div>
    );
  }

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
