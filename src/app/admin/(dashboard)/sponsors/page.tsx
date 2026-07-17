"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Pencil, Plus } from "lucide-react";
import { fetchSponsors } from "@/lib/queries/sponsors";
import { createClient } from "@/lib/supabase/client";
import { Sponsor } from "@/types/sponsor";

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarSponsors = async () => {
      const data = await fetchSponsors();
      setSponsors(data);
      setLoading(false);
    };
    cargarSponsors();
  }, []);

  async function handleEliminar(id: number) {
    const confirmar = confirm(
      "¿Eliminar este sponsor? Esta acción no se puede deshacer.",
    );
    if (!confirmar) return;

    const supabase = createClient();
    const { error, count } = await supabase
      .from("sponsors")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) {
      alert("Error al eliminar: " + error.message);
      return;
    }

    if (count === 0) {
      alert("No se pudo eliminar: revisa los permisos.");
      return;
    }

    setSponsors((prev) => prev.filter((s) => s.id !== id));
  }

  function estaActivo(sponsor: Sponsor) {
    const ahora = new Date();
    return (
      new Date(sponsor.fecha_inicio) <= ahora &&
      new Date(sponsor.fecha_fin) >= ahora
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Sponsors</h1>
        <Link
          href="/admin/sponsors/nuevo"
          className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider px-3 py-2 bg-ink text-background hover:bg-ink/90 transition-colors"
        >
          <Plus size={14} />
          Nuevo
        </Link>
      </div>

      {loading && <p className="font-mono text-sm text-muted">Cargando...</p>}

      <div className="flex flex-col gap-2">
        {sponsors.map((sponsor) => (
          <div
            key={sponsor.id}
            className="flex items-center gap-3 border border-hairline p-3"
          >
            <div className="relative w-12 h-12 shrink-0 bg-surface border border-hairline">
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
                className={`font-mono text-[10px] uppercase ${
                  estaActivo(sponsor) ? "text-accent" : "text-muted"
                }`}
              >
                {estaActivo(sponsor) ? "Activo" : "Inactivo"}
              </span>
            </div>

            <Link
              href={`/admin/sponsors/${sponsor.id}/editar`}
              className="p-2 text-muted hover:text-ink transition-colors"
              aria-label="Editar"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => handleEliminar(sponsor.id)}
              className="p-2 text-muted hover:text-red-600 transition-colors"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {!loading && sponsors.length === 0 && (
        <p className="font-mono text-sm text-muted">No hay sponsors todavía.</p>
      )}
    </div>
  );
}
