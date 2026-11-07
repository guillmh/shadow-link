import type { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria } from "@/types/categoria";

export async function listarCategorias(supabase: SupabaseClient): Promise<{
  categorias: Categoria[];
  errorCategorias: string;
}> {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .order("nombre");

  return {
    categorias: data ?? [],
    errorCategorias: error?.code === "PGRST205"
      ? "Aplica la migración de categorías en Supabase para activar esta sección."
      : error ? "No se pudieron cargar las categorías. Vuelve a intentarlo." : "",
  };
}
