"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { subirImagen } from "@/lib/storage";
import { sponsorSchema, SponsorFormValues } from "@/lib/schemas/sponsor";
import { Sponsor } from "@/types/sponsor";
import FormField from "./FormField";

type SponsorFormProps = {
  sponsorExistente?: Sponsor;
};

function formatearParaInput(fechaISO: string) {
  return fechaISO ? fechaISO.slice(0, 16) : "";
}

export default function SponsorForm({ sponsorExistente }: SponsorFormProps) {
  const router = useRouter();
  const esEdicion = !!sponsorExistente;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorFormValues>({
    resolver: zodResolver(sponsorSchema),
    defaultValues: {
      marca: sponsorExistente?.marca ?? "",
      descripcion: sponsorExistente?.descripcion ?? "",
      link: sponsorExistente?.link ?? "",
      fecha_inicio: formatearParaInput(sponsorExistente?.fecha_inicio ?? ""),
      fecha_fin: formatearParaInput(sponsorExistente?.fecha_fin ?? ""),
    },
  });

  const [logoActual] = useState(sponsorExistente?.logo ?? "");
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(datos: SponsorFormValues) {
    setError("");
    setSubiendo(true);

    let urlLogo = logoActual || null;

    if (archivoLogo) {
      const resultado = await subirImagen(archivoLogo, "productos", "sponsors");
      if (resultado.error) {
        setError("Error al subir logo: " + resultado.error);
        setSubiendo(false);
        return;
      }
      urlLogo = resultado.url;
    }

    if (!urlLogo) {
      setError("Debes subir un logo");
      setSubiendo(false);
      return;
    }

    const supabase = createClient();
    const payload = {
      marca: datos.marca,
      descripcion: datos.descripcion || null,
      link: datos.link,
      logo: urlLogo,
      fecha_inicio: new Date(datos.fecha_inicio).toISOString(),
      fecha_fin: new Date(datos.fecha_fin).toISOString(),
    };

    const { error: dbError } = esEdicion
      ? await supabase
          .from("sponsors")
          .update(payload)
          .eq("id", sponsorExistente!.id)
      : await supabase.from("sponsors").insert(payload);

    setSubiendo(false);

    if (dbError) {
      setError("Error al guardar: " + dbError.message);
      return;
    }

    router.push("/admin/sponsors");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-md"
    >
      <FormField
        label="Marca"
        registro={register("marca")}
        error={errors.marca?.message}
      />
      <FormField label="Descripción" registro={register("descripcion")} />
      <FormField
        label="Link"
        type="url"
        registro={register("link")}
        error={errors.link?.message}
        placeholder="https://..."
      />

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Fecha inicio
        </label>
        <input
          type="datetime-local"
          {...register("fecha_inicio")}
          className="w-full font-body text-sm px-3 py-2 bg-surface border border-hairline text-ink focus:outline-none focus:border-ink transition-colors"
        />
        {errors.fecha_inicio && (
          <p className="font-mono text-xs text-red-600 mt-1">
            {errors.fecha_inicio.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Fecha fin
        </label>
        <input
          type="datetime-local"
          {...register("fecha_fin")}
          className="w-full font-body text-sm px-3 py-2 bg-surface border border-hairline text-ink focus:outline-none focus:border-ink transition-colors"
        />
        {errors.fecha_fin && (
          <p className="font-mono text-xs text-red-600 mt-1">
            {errors.fecha_fin.message}
          </p>
        )}
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-1">
          Logo
        </label>
        {logoActual && !archivoLogo && (
          <img
            src={logoActual}
            alt="Actual"
            className="w-20 h-20 object-contain border border-hairline mb-2 bg-surface"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setArchivoLogo(e.target.files?.[0] ?? null)}
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
            : "Crear sponsor"}
      </button>
    </form>
  );
}
