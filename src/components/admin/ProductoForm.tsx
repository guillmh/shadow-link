"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { subirImagen } from "@/lib/storage";
import { productoSchema, ProductoFormValues } from "@/lib/schemas/producto";
import type { ProductoAdmin } from "@/types/producto";
import type { Categoria } from "@/types/categoria";
import FormField from "./FormField";
import AdminForm from "./AdminForm";
import ImageField from "./ImageField";

type ProductoFormProps = {
  productoExistente?: ProductoAdmin;
  categorias: Categoria[];
  errorCategorias: string;
};

export default function ProductoForm({ productoExistente, categorias, errorCategorias }: ProductoFormProps) {
  const router = useRouter();
  const esEdicion = !!productoExistente;

  const {
    register,
    handleSubmit,
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

  const imagenActual = productoExistente?.imagen ?? "";
  const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
  const [fase, setFase] = useState<"imagen" | "datos" | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(datos: ProductoFormValues) {
    const categoria = categorias.find(({ nombre }) => nombre === datos.categoria);
    if (!categoria) {
      setError("Selecciona una categoría de la lista.");
      return;
    }
    setError("");
    if (!archivoImagen && !imagenActual) {
      setError("Elige una imagen para el producto.");
      return;
    }
    setFase(archivoImagen ? "imagen" : "datos");

    try {
      let urlImagen = imagenActual;

      if (archivoImagen) {
        const resultado = await subirImagen(archivoImagen, "productos", String(categoria.id));
        if (!resultado.url) {
          setError(resultado.error ?? "No se pudo subir la imagen.");
          return;
        }
        urlImagen = resultado.url;
      }

      setFase("datos");
      const supabase = createClient();
      const payload = {
        ...datos,
        descripcion: datos.descripcion || null,
        imagen: urlImagen,
      };

      let escritura;
      if (productoExistente) {
        const actualizacion = supabase.from("productos").update(payload).eq("id", productoExistente.id);
        // Una edición abierta antes de borrar o renombrar la categoría puede estar desactualizada.
        escritura = productoExistente.categoria === null
          ? actualizacion.is("categoria", null)
          : actualizacion.eq("categoria", productoExistente.categoria);
      } else {
        escritura = supabase.from("productos").insert(payload);
      }
      const { data: guardado, error: dbError } = await escritura.select("id").maybeSingle();

      if (dbError || !guardado) {
        setError(dbError && dbError.code !== "23503"
          ? "Error al guardar: " + dbError.message
          : "El producto o la categoría cambió. Recarga la página e inténtalo de nuevo.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("No se pudo guardar el producto. Vuelve a intentarlo.");
    } finally {
      setFase(null);
    }
  }

  return (
    <AdminForm
      onSubmit={handleSubmit(onSubmit)}
      enviando={fase !== null}
      textoEspera={fase === "imagen" ? "Subiendo imagen…" : "Guardando producto…"}
      deshabilitado={categorias.length === 0}
      error={error}
      textoBoton={esEdicion ? "Guardar cambios" : "Crear producto"}
    >
      <FormField
        label="Nombre"
        registro={register("nombre")}
        error={errors.nombre?.message}
      />
      <FormField label="Descripción" registro={register("descripcion")} />
      <div>
        <label htmlFor="categoria" className="label-mono block mb-1">Categoría</label>
        <select
          id="categoria"
          className={`field min-h-11${errors.categoria ? " is-error" : ""}`}
          disabled={categorias.length === 0}
          aria-invalid={errors.categoria ? true : undefined}
          aria-describedby={errors.categoria ? "categoria-error categoria-ayuda" : "categoria-ayuda"}
          {...register("categoria")}
        >
          <option value="" disabled>Selecciona una categoría</option>
          {categorias.map(({ id, nombre }) => (
            <option key={id} value={nombre}>{nombre}</option>
          ))}
        </select>
        {errors.categoria && <p id="categoria-error" className="mt-1.5 text-sm text-danger">{errors.categoria.message}</p>}
        <div id="categoria-ayuda" className="mt-2 space-y-1 text-sm text-muted">
          {errorCategorias ? (
            <p role="alert" className="text-danger">{errorCategorias}</p>
          ) : categorias.length === 0 ? (
            <p>Crea una categoría antes de guardar el producto.</p>
          ) : productoExistente?.categoria === null ? (
            <p>Este producto está oculto. Asígnale una categoría para volver a publicarlo.</p>
          ) : null}
          <Link href={categorias.length || errorCategorias ? "/admin/categorias" : "/admin/categorias/nuevo"} className="text-accent underline underline-offset-4">
            {categorias.length || errorCategorias ? "Gestionar categorías" : "Crear categoría"}
          </Link>
        </div>
      </div>
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
        archivo={archivoImagen}
        onArchivo={(archivo) => {
          setArchivoImagen(archivo);
          setError("");
        }}
      />
    </AdminForm>
  );
}
