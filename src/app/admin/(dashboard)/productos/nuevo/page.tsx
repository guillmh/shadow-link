import ProductoForm from "@/components/admin/ProductoForm";
import { listarCategorias } from "@/lib/queries/categorias";
import { createClient } from "@/lib/supabase/server";

export default async function NuevoProductoPage() {
  const opciones = await listarCategorias(await createClient());
  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Nuevo producto</h1>
      <ProductoForm {...opciones} />
    </div>
  );
}
