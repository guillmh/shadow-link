"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/categoria";
import AdminForm from "./AdminForm";
import FormField from "./FormField";

const categoriaSchema = z.object({
  nombre: z.string().trim()
    .min(1, "Escribe el nombre de la categoría.")
    .max(60, "Usa un máximo de 60 caracteres.")
    .refine((nombre) => nombre.toLowerCase() !== "todos", "«Todos» está reservado para el filtro del catálogo."),
});

export default function CategoriaForm({ categoria }: { categoria?: Categoria }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, setError: marcarCampo, formState: { errors, isSubmitting } } =
    useForm<z.infer<typeof categoriaSchema>>({
      resolver: zodResolver(categoriaSchema),
      defaultValues: { nombre: categoria?.nombre ?? "" },
    });

  async function guardar(datos: z.infer<typeof categoriaSchema>) {
    setError("");
    const tabla = createClient().from("categorias");
    const escritura = categoria
      ? tabla.update(datos).eq("id", categoria.id).eq("nombre", categoria.nombre)
      : tabla.insert(datos);
    const { data, error: dbError } = await escritura.select("id").maybeSingle();

    if (dbError?.code === "23505") {
      marcarCampo("nombre", { message: "Ya existe una categoría con ese nombre." }, { shouldFocus: true });
      return;
    }
    if (dbError || !data) {
      setError(dbError
        ? "No se pudo guardar la categoría. Vuelve a intentarlo."
        : "La categoría cambió. Recarga la página para ver su estado actual.");
      return;
    }

    router.push("/admin/categorias");
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin/categorias" className="btn btn-ghost mb-4">Volver a categorías</Link>
      <h1 className="font-display text-2xl text-ink mb-2">{categoria ? "Editar categoría" : "Nueva categoría"}</h1>
      <p className="text-sm text-muted mb-6">
        {categoria ? "El nuevo nombre se aplicará a todos los productos de esta categoría." : "Podrás elegirla al crear o editar un producto."}
      </p>
      <AdminForm
        onSubmit={handleSubmit(guardar)}
        enviando={isSubmitting}
        error={error}
        textoBoton={categoria ? "Guardar cambios" : "Crear categoría"}
      >
        <FormField
          label="Nombre de la categoría"
          registro={register("nombre")}
          error={errors.nombre?.message}
        />
      </AdminForm>
    </div>
  );
}
