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
import AdminForm from "./AdminForm";
import ImageField from "./ImageField";

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

  const logoActual = sponsorExistente?.logo ?? "";
  const [archivoLogo, setArchivoLogo] = useState<File | null>(null);
  const [fase, setFase] = useState<"imagen" | "datos" | null>(null);
  const [error, setError] = useState("");

  async function onSubmit(datos: SponsorFormValues) {
    setError("");
    if (!archivoLogo && !logoActual) {
      setError("Elige un logo para el sponsor.");
      return;
    }
    setFase(archivoLogo ? "imagen" : "datos");

    try {
      let urlLogo = logoActual;
      if (archivoLogo) {
        const resultado = await subirImagen(archivoLogo, "productos", "sponsors");
        if (!resultado.url) {
          setError(resultado.error ?? "No se pudo subir el logo.");
          return;
        }
        urlLogo = resultado.url;
      }

      setFase("datos");
      const supabase = createClient();
      const payload = {
        marca: datos.marca,
        descripcion: datos.descripcion || null,
        link: datos.link,
        logo: urlLogo,
        fecha_inicio: new Date(datos.fecha_inicio).toISOString(),
        fecha_fin: new Date(datos.fecha_fin).toISOString(),
      };

      const { error: dbError } = sponsorExistente
        ? await supabase.from("sponsors").update(payload).eq("id", sponsorExistente.id)
        : await supabase.from("sponsors").insert(payload);

      if (dbError) {
        setError("Error al guardar: " + dbError.message);
        return;
      }
      router.push("/admin/sponsors");
      router.refresh();
    } catch {
      setError("No se pudo guardar el sponsor. Vuelve a intentarlo.");
    } finally {
      setFase(null);
    }
  }

  return (
    <AdminForm
      onSubmit={handleSubmit(onSubmit)}
      enviando={fase !== null}
      textoEspera={fase === "imagen" ? "Subiendo logo…" : "Guardando sponsor…"}
      error={error}
      textoBoton={esEdicion ? "Guardar cambios" : "Crear sponsor"}
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
        <label htmlFor="fecha-inicio" className="label-mono block mb-1">Fecha de inicio</label>
        <input id="fecha-inicio" type="datetime-local" {...register("fecha_inicio")} className="field" />
        {errors.fecha_inicio && (
          <p className="font-mono text-[11px] text-danger mt-1.5">
            {errors.fecha_inicio.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="fecha-fin" className="label-mono block mb-1">Fecha de fin</label>
        <input id="fecha-fin" type="datetime-local" {...register("fecha_fin")} className="field" />
        {errors.fecha_fin && (
          <p className="font-mono text-[11px] text-danger mt-1.5">
            {errors.fecha_fin.message}
          </p>
        )}
      </div>

      <ImageField
        etiqueta="Logo"
        imagenActual={logoActual}
        archivo={archivoLogo}
        onArchivo={(archivo) => {
          setArchivoLogo(archivo);
          setError("");
        }}
      />
    </AdminForm>
  );
}
