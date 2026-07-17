"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { subirImagen } from "@/lib/storage";
import { productoSchema, ProductoFormValues } from "@/lib/schemas/producto";
import { Producto } from "@/types/producto";
import FormField from "./FormField";

type ProductoFormProps = {
  productoExistente?: Producto;
};

export default function ProductoForm({ productoExistente }: ProductoFormProps) {
  const router = useRouter();
  const esEdicion = !!productoExistente;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: productoExistente?.nombre ?? "",
      descripcion: productoExistente?.descripcion ?? "",
      categoria: productoExistente?.categoria ?? "",
      link: productoExistente?.link ?? "",
    },
  });

  const categoriaActual = watch("categoria");

  const imagenActual = productoExistente?.imagen ?? "";
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(datos: ProductoFormValues) {
    setError("");
    setSubiendo(true);

    let urlImagen = imagenActual || null;

    if (archivoImagen) {
      const resultado = await subirImagen(
        archivoImagen,
        "productos",
        categoriaActual || "general",
      );
      if (resultado.error) {
        setError("Error al subir imagen: " + resultado.error);
        setSubiendo(false);
        return;
      }
      urlImagen = resultado.url;
    }

    if (!urlImagen) {
      setError("Debes subir una imagen");
      setSubiendo(false);
      return;
    }

    const supabase = createClient();
    const payload = {
      ...datos,
      descripcion: datos.descripcion || null,
      imagen: urlImagen,
    };

    const { error: dbError } = esEdicion
      ? await supabase
          .from("productos")
          .update(payload)
          .eq("id", productoExistente!.id)
      : await supabase.from("productos").insert(payload);

    setSubiendo(false);

    if (dbError) {
      setError("Error al guardar: " + dbError.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-md"
    >
      <FormField
        label="Nombre"
        registro={register("nombre")}
        error={errors.nombre?.message}
      />
      <FormField label="Descripción" registro={register("descripcion")} />
      <FormField
        label="Categoría"
        registro={register("categoria")}
        error={errors.categoria?.message}
        placeholder="ej: mouses, audifonos"
      />
      <FormField
        label="Link de compra"
        type="url"
        registro={register("link")}
        error={errors.link?.message}
        placeholder="https://..."
      />

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Imagen
        </label>
        {imagenActual && !archivoImagen && (
          <Image
            src={imagenActual}
            alt="Actual"
            width={80}
            height={80}
            className="object-contain border border-hairline mb-2 bg-surface"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivoImagen(e.target.files?.[0] ?? null)}
          className="w-full font-body text-sm text-ink file:mr-3 file:py-2 file:px-3 file:border file:border-hairline file:bg-surface file:font-mono file:text-xs file:uppercase"
        />
      </div>

      {error && <p className="font-mono text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={subiendo}
        className="font-mono text-xs uppercase tracking-wider py-2.5 bg-ink text-background hover:bg-ink/90 disabled:opacity-50 transition-colors"
      >
        {subiendo
          ? "Guardando..."
          : esEdicion
            ? "Guardar cambios"
            : "Crear producto"}
      </button>
    </form>
  );
}
