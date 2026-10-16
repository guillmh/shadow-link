import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import { Sponsor } from "@/types/sponsor";

/**
 * Módulo CLIENT-SAFE: usa el cliente de navegador (`@/lib/supabase/client`).
 */

export async function fetchSponsors(): Promise<Sponsor[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("fecha_inicio", { ascending: false });

  if (error) {
    logger.error("Error cargando sponsors", error);
    return [];
  }

  return (data ?? []) as Sponsor[];
}

/**
 * Devuelve el sponsor activo (dentro de su ventana de fechas) o `null`.
 * Extraído de la lógica inline de `src/components/SponsorBanner.tsx`.
 */
export async function fetchActiveSponsor(): Promise<Sponsor | null> {
  const supabase = createClient();
  const ahora = new Date().toISOString();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .lte("fecha_inicio", ahora)
    .gte("fecha_fin", ahora)
    .order("fecha_inicio", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.error("Error cargando sponsor activo", error);
    return null;
  }

  return (data as Sponsor | null) ?? null;
}
