import { ReactNode } from "react";
import Link from "next/link";
import { Trash2, Pencil, Plus } from "lucide-react";

type AdminListProps<T> = {
  titulo: string;
  hrefNuevo: string;
  /** Base del enlace de edición, p. ej. `/admin/productos`. */
  baseEdicion: string;
  loading: boolean;
  items: T[];
  mensajeVacio: string;
  onEliminar: (id: number) => void;
  /** Parte específica de la fila: miniatura + nombre + subtítulo/badge. */
  renderContenido: (item: T) => ReactNode;
};

/**
 * Andamiaje compartido de las listas del panel admin: encabezado con el botón
 * «Nuevo», estado de carga, contenedor de filas, acciones (editar/eliminar) y
 * mensaje de lista vacía.
 */
export default function AdminList<T extends { id: number }>({
  titulo,
  hrefNuevo,
  baseEdicion,
  loading,
  items,
  mensajeVacio,
  onEliminar,
  renderContenido,
}: AdminListProps<T>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">{titulo}</h1>
        <Link href={hrefNuevo} className="btn btn-primary">
          <Plus size={14} />
          Nuevo
        </Link>
      </div>

      {loading && <p className="font-mono text-sm text-muted">Cargando...</p>}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="arow">
            {renderContenido(item)}

            <Link
              href={`${baseEdicion}/${item.id}/editar`}
              className="icon-btn"
              aria-label="Editar"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => onEliminar(item.id)}
              className="icon-btn danger"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {!loading && items.length === 0 && (
        <p className="font-mono text-sm text-muted">{mensajeVacio}</p>
      )}
    </div>
  );
}
