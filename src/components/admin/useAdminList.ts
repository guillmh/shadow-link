"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ConId = { id: number };

type OpcionesUseAdminList<T extends ConId> = {
  /** Función de carga estable (importada del módulo de queries). */
  cargar: () => Promise<T[]>;
  tabla: string;
  mensajeConfirmar: string;
  /**
   * Sponsors pide `count: "exact"` y avisa si no se borró nada; productos no.
   * Se mantiene como está para no cambiar el comportamiento de ninguna de las dos listas.
   */
  verificarConteo?: boolean;
};

/**
 * Estado compartido de las listas del panel admin: carga inicial + borrado
 * con `confirm()` (idéntico al que ya tenían las dos páginas).
 */
export function useAdminList<T extends ConId>({
  cargar,
  tabla,
  mensajeConfirmar,
  verificarConteo = false,
}: OpcionesUseAdminList<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarItems = async () => {
      const data = await cargar();
      setItems(data);
      setLoading(false);
    };
    cargarItems();
  }, [cargar]);

  async function eliminar(id: number) {
    const confirmar = confirm(mensajeConfirmar);
    if (!confirmar) return;

    const supabase = createClient();
    const { error, count } = verificarConteo
      ? await supabase.from(tabla).delete({ count: "exact" }).eq("id", id)
      : await supabase.from(tabla).delete().eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    if (verificarConteo && count === 0) {
      alert("No se pudo eliminar: revisa los permisos.");
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  return { items, loading, eliminar };
}
