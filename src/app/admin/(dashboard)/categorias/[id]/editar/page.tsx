import { notFound } from "next/navigation";
import CategoriaForm from "@/components/admin/CategoriaForm";
import { createClient } from "@/lib/supabase/server";
import type { Categoria } from "@/types/categoria";

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[1-9]\d{0,15}$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("id", id)
    .maybeSingle<Categoria>();

  if (error) throw new Error("No se pudo cargar la categoría.");
  if (!data) notFound();

  return <CategoriaForm categoria={data} />;
}
