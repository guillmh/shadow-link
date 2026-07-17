import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductoForm from "@/components/admin/ProductoForm";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: producto } = await supabase
    .from("productos")
    .select("*")
    .eq("id", id)
    .single();

  if (!producto) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Editar producto</h1>
      <ProductoForm productoExistente={producto} />
    </div>
  );
}
