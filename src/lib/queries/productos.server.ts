import "server-only";

import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import { Producto } from "@/types/producto";

export type ProductosPaginados = {
  productos: Producto[];
  total: number;
};

export type FetchProductosPaginadoParams = {
  pagina?: number;
  porPagina?: number;
  categoria?: string | null;
  busqueda?: string | null;
};

/**
 * Lectura paginada y filtrada de productos usando el cliente de servidor.
 * Pensada para componentes de servidor (RSC). El cliente de navegador debe
 * seguir usando `@/lib/queries/productos`.
 */
export async function fetchProductosPaginado({
  pagina = 1,
  porPagina = 10,
  categoria,
  busqueda,
}: FetchProductosPaginadoParams = {}): Promise<ProductosPaginados> {
  const supabase = await createClient();

  const paginaSegura = Math.max(1, Math.floor(pagina));
  const porPaginaSegura = Math.max(1, Math.floor(porPagina));
  const desde = (paginaSegura - 1) * porPaginaSegura;
  const hasta = desde + porPaginaSegura - 1;

  let query = supabase.from("productos").select("*", { count: "exact" });

  if (categoria && categoria !== "todos") {
    query = query.eq("categoria", categoria);
  }

  const termino = busqueda?.trim();
  if (termino) {
    query = query.ilike("nombre", `%${termino}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(desde, hasta);

  if (error) {
    logger.error("Error cargando productos paginados", error);
    throw new Error(`No se pudieron cargar los productos: ${error.message}`);
  }

  return {
    productos: (data ?? []) as Producto[],
    total: count ?? 0,
  };
}

/**
 * Devuelve la lista de categorías distintas de productos.
 * Reemplaza la derivación en cliente que hacía `new Set(productos.map(...))`.
 */
export async function fetchCategorias(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("categoria")
    .order("categoria", { ascending: true });

  if (error) {
    logger.error("Error cargando categorías", error);
    throw new Error(`No se pudieron cargar las categorías: ${error.message}`);
  }

  const filas = (data ?? []) as Pick<Producto, "categoria">[];
  return Array.from(new Set(filas.map((fila) => fila.categoria)));
}

/**
 * Lista completa de productos ordenada por `created_at` descendente usando el
 * cliente de servidor. Pensada para el render inicial en RSC (evita el
 * waterfall de data-fetching en cliente). Equivale a `fetchProductos` de
 * `@/lib/queries/productos`, pero del lado servidor.
 */
export async function fetchProductosServer(): Promise<Producto[]> {
  const supabase = await createClient();

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
