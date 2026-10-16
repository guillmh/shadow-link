import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import { Producto } from "@/types/producto";

/**
 * Módulo CLIENT-SAFE: usa el cliente de navegador (`@/lib/supabase/client`).
 * No importar aquí `@/lib/supabase/server` ni módulos `*.server.ts`.
 *
 * En caso de error lanza (en lugar de devolver `[]` silenciosamente) y lo
 * registra mediante el logger compartido.
 */
export async function fetchProductos(): Promise<Producto[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error cargando productos", error);
    throw new Error(`No se pudieron cargar los productos: ${error.message}`);
  }

  return (data ?? []) as Producto[];
}
