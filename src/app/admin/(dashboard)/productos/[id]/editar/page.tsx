import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import ProductoForm from "@/components/admin/ProductoForm";
import { Producto } from "@/types/producto";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single<Producto>();

  // 0 filas: `PGRST116` (id desconocido o fuera del alcance de RLS) o
  // `22P02` (id que no puede convertirse a número). En ambos casos no existe
  // fila que mostrar, así que se responde 404 en lugar de fallar en silencio.
  if (error && (error.code === "PGRST116" || error.code === "22P02")) {
    notFound();
  }

  // Resto de fallos (permisos, red, esquema): error claro y registrado.
  if (error) {
    logger.error("Error cargando producto para editar", error);
    throw new Error(`No se pudo cargar el producto: ${error.message}`);
  }

  if (!data) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Editar producto</h1>
      <ProductoForm productoExistente={data} />
    </div>
  );
}
