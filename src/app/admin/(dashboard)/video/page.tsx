"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { videoSchema, VideoFormValues } from "@/lib/schemas/video";
import FormField from "@/components/admin/FormField";

export default function AdminVideo() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

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

    const supabase = createClient();
    const { error } = await supabase
      .from("configuracion")
      .update({ ultimo_video_url: datos.ultimo_video_url })
      .eq("id", 1);

    setGuardando(false);

    if (error) {
      setMensaje("Error al guardar: " + error.message);
      return;
    }

    setMensaje("Guardado correctamente");
  }

  if (cargando) {
    return <p className="font-mono text-sm text-muted">Cargando...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Último video</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 max-w-md"
      >
        <FormField
          label="Link de YouTube"
          type="url"
          registro={register("ultimo_video_url")}
          error={errors.ultimo_video_url?.message}
          placeholder="https://www.youtube.com/watch?v=..."
        />

        {mensaje && <p className="font-mono text-xs text-accent">{mensaje}</p>}

        <button
          type="submit"
          disabled={guardando}
          className="font-mono text-xs uppercase tracking-wider py-2.5 bg-ink text-background hover:bg-ink/90 disabled:opacity-50 transition-colors"
        >
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
