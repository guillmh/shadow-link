"use client";

import Image from "next/image";
import { fetchProductos } from "@/lib/queries/productos";
import { Producto } from "@/types/producto";
import AdminList from "@/components/admin/AdminList";
import { useAdminList } from "@/components/admin/useAdminList";

export default function AdminProductos() {
  const { items: productos, loading, eliminar } = useAdminList<Producto>({
    cargar: fetchProductos,
    tabla: "productos",
    mensajeConfirmar:
      "¿Eliminar este producto? Esta acción no se puede deshacer.",
  });

  return (
    <AdminList<Producto>
      titulo="Productos"
      hrefNuevo="/admin/productos/nuevo"
      baseEdicion="/admin/productos"
      loading={loading}
      items={productos}
      mensajeVacio="No hay productos todavía."
      onEliminar={eliminar}
      renderContenido={(producto) => (
        <>
          <div className="thumb relative w-12 h-12 shrink-0">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-ink truncate">
              {producto.nombre}
            </p>
            <span className="font-mono text-[10px] uppercase text-muted">
              {producto.categoria}
            </span>
          </div>
        </>
      )}
    />
  );
}
