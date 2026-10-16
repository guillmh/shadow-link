"use client";

import Image from "next/image";
import { fetchSponsors } from "@/lib/queries/sponsors";
import { Sponsor } from "@/types/sponsor";
import AdminList from "@/components/admin/AdminList";
import { useAdminList } from "@/components/admin/useAdminList";

export default function AdminSponsors() {
  const { items: sponsors, loading, eliminar } = useAdminList<Sponsor>({
    cargar: fetchSponsors,
    tabla: "sponsors",
    mensajeConfirmar: "¿Eliminar este sponsor? Esta acción no se puede deshacer.",
    verificarConteo: true,
  });

  function estaActivo(sponsor: Sponsor) {
    const ahora = new Date();
    return (
      new Date(sponsor.fecha_inicio) <= ahora &&
      new Date(sponsor.fecha_fin) >= ahora
    );
  }

  return (
    <AdminList<Sponsor>
      titulo="Sponsors"
      hrefNuevo="/admin/sponsors/nuevo"
      baseEdicion="/admin/sponsors"
      loading={loading}
      items={sponsors}
      mensajeVacio="No hay sponsors todavía."
      onEliminar={eliminar}
      renderContenido={(sponsor) => (
        <>
          <div className="thumb relative w-12 h-12 shrink-0">
            <Image
              src={sponsor.logo}
              alt={sponsor.marca}
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-body text-sm text-ink truncate">
              {sponsor.marca}
            </p>
            <span
              className={`badge mt-1 ${
                estaActivo(sponsor) ? "badge-accent" : "badge-muted"
              }`}
            >
              {estaActivo(sponsor) ? "Activo" : "Inactivo"}
            </span>
          </div>
        </>
      )}
    />
  );
}
