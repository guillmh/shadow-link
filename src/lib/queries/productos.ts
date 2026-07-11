import { supabase } from "@/lib/supabase";
import { Producto } from "@/types/producto";

export async function fetchProductos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error cargando productos:", error);
    return [];
  }

  return data as Producto[];
}
