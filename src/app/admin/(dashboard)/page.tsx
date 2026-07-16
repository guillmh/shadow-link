"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Pencil, Plus } from "lucide-react";
import { fetchProductos } from "@/lib/queries/productos";
import { createClient } from "@/lib/supabase/client";
import { Producto } from "@/types/producto";

export default function AdminProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  async function cargarProductos() {
    const data = await fetchProductos();
    setProductos(data);
    setLoading(false);
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  async function handleEliminar(id: number) {
    const confirmar = confirm(
      "¿Eliminar este producto? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return;

    const supabase = createClient();
    const { error } = await supabase.from("productos").delete().eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    setProductos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-2 bg-ink text-background hover:bg-ink/90 transition-colors"
        >
          <Plus size={14} />
          Nuevo
        </Link>
      </div>

      {loading && <p className="font-mono text-sm text-muted">Cargando...</p>}

      <div className="flex flex-col gap-2">
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center gap-3 border border-hairline p-3"
          >
            <div className="relative w-12 h-12 shrink-0 bg-surface border border-hairline">
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

            <Link
              href={`/admin/productos/${producto.id}/editar`}
              className="p-2 text-muted hover:text-ink transition-colors"
              aria-label="Editar"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => handleEliminar(producto.id)}
              className="p-2 text-muted hover:text-red-600 transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {!loading && productos.length === 0 && (
        <p className="font-mono text-sm text-muted">
          No hay productos todavía.
        </p>
      )}
    </div>
  );
}
