"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { subirImagen } from "@/lib/storage";
import { productoSchema, ProductoFormValues } from "@/lib/schemas/producto";
import { Producto } from "@/types/producto";
import FormField from "./FormField";
import AdminForm from "./AdminForm";
import ImageField from "./ImageField";

type ProductoFormProps = {
  productoExistente?: Producto;
};

export default function ProductoForm({ productoExistente }: ProductoFormProps) {
  const router = useRouter();
  const esEdicion = !!productoExistente;

  const {
    register,
    handleSubmit,
    control,
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

  const categoriaActual = useWatch({ control, name: "categoria" });

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
    <AdminForm
      onSubmit={handleSubmit(onSubmit)}
      enviando={subiendo}
      error={error}
      textoBoton={esEdicion ? "Guardar cambios" : "Crear producto"}
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

      <ImageField
        etiqueta="Imagen"
        imagenActual={imagenActual}
        tieneArchivo={archivoImagen !== null}
        onArchivo={setArchivoImagen}
        classNamePreview="thumb object-contain mb-2"
      />
    </AdminForm>
  );
}
