import "server-only";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { Sponsor } from "@/types/sponsor";

/**
 * Variante de servidor de `@/lib/queries/sponsors` para usar en RSC.
 */
export async function fetchSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sponsors")
    .select("*")
    .order("fecha_inicio", { ascending: false });

  if (error) {
    logger.error("Error cargando sponsors", error);
    throw new Error(`No se pudieron cargar los sponsors: ${error.message}`);
  }

  return (data ?? []) as Sponsor[];
}

/**
 * Devuelve el sponsor activo (dentro de su ventana de fechas) o `null`.
 */
export async function fetchActiveSponsor(): Promise<Sponsor | null> {
  const supabase = await createClient();
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
