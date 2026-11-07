"use client";

import AdminList from "@/components/admin/AdminList";
import { useAdminList } from "@/components/admin/useAdminList";
import { listarCategorias } from "@/lib/queries/categorias";
import { createClient } from "@/lib/supabase/client";
import type { Categoria } from "@/types/categoria";

async function cargarCategorias() {
  const { categorias, errorCategorias } = await listarCategorias(createClient());
  if (errorCategorias) throw new Error(errorCategorias);
  return categorias;
}

export default function AdminCategorias() {
  const { items, loading, errorCarga, eliminar } = useAdminList<Categoria>({
    cargar: cargarCategorias,
    tabla: "categorias",
    verificarConteo: true,
    mensajeConfirmar: ({ nombre }) =>
      `¿Eliminar «${nombre}»? Sus productos seguirán en el panel, pero se ocultarán de la portada y el catálogo hasta que les asignes otra categoría.`,
  });

  return (
    <AdminList<Categoria>
      titulo="Categorías"
      descripcion="Crea y edita las categorías que puedes asignar a tus productos."
      hrefNuevo="/admin/categorias/nuevo"
      baseEdicion="/admin/categorias"
      loading={loading}
      errorCarga={errorCarga}
      items={items}
      mensajeVacio="Crea tu primera categoría para poder asignarla a un producto."
      onEliminar={eliminar}
      nombreItem={({ nombre }) => nombre}
      renderContenido={({ nombre }) => <p className="min-w-0 flex-1 wrap-anywhere text-sm text-ink">{nombre}</p>}
    />
  );
}
