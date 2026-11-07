"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { videoSchema, VideoFormValues } from "@/lib/schemas/video";
import FormField from "@/components/admin/FormField";
import AdminForm from "@/components/admin/AdminForm";

export default function AdminVideo() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [errorGuardar, setErrorGuardar] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
  });

  useEffect(() => {
    async function cargar() {
      const supabase = createClient();
      const { data } = await supabase
        .from("configuracion")
        .select("ultimo_video_url")
        .eq("id", 1)
        .single();

      if (data) {
        reset({ ultimo_video_url: data.ultimo_video_url });
      }
      setCargando(false);
    }

    cargar();
  }, [reset]);

  async function onSubmit(datos: VideoFormValues) {
    setGuardando(true);
    setMensaje("");
    setErrorGuardar("");

    const supabase = createClient();
    const { error } = await supabase
      .from("configuracion")
      .update({ ultimo_video_url: datos.ultimo_video_url })
      .eq("id", 1);

    setGuardando(false);

    if (error) {
      setErrorGuardar("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Guardado correctamente");
  }

  if (cargando) {
    return <p role="status" className="text-sm text-muted">Cargando video…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-2">Video de respaldo</h1>
      <p className="text-sm text-muted mb-6">
        La portada muestra el video más reciente de ShadowEZ en YouTube. Este
        enlace se usa si no se puede consultar el canal.
      </p>

      <AdminForm
        onSubmit={handleSubmit(onSubmit)}
        enviando={guardando}
        textoBoton="Guardar video"
        error={errorGuardar}
      >
        <FormField
          label="Link de YouTube"
          type="url"
          registro={register("ultimo_video_url")}
          error={errors.ultimo_video_url?.message}
          placeholder="https://www.youtube.com/watch?v=..."
        />

      </AdminForm>
      {mensaje && <p role="status" className="mt-4 text-sm text-accent">{mensaje}</p>}
    </div>
  );
}
