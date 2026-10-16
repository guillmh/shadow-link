import "server-only";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export type Configuracion = {
  id: number;
  ultimo_video_url: string | null;
};

/**
 * Lee la fila de configuración global (`id = 1`), que contiene la URL del
 * último video de YouTube. Extraído de la lectura en cliente de `LatestVideo`.
 */
export async function fetchConfiguracion(): Promise<Configuracion | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("configuracion")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    logger.error("Error cargando configuración", error);
    return null;
  }

  return (data as Configuracion | null) ?? null;
}

/**
 * Atajo que devuelve directamente la URL del último video (o `null`).
 */
export async function fetchUltimoVideoUrl(): Promise<string | null> {
  const configuracion = await fetchConfiguracion();
  return configuracion?.ultimo_video_url ?? null;
}
