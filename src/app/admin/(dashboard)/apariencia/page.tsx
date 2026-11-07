"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminForm from "@/components/admin/AdminForm";
import ImageField from "@/components/admin/ImageField";
import { createClient } from "@/lib/supabase/client";
import { subirImagen } from "@/lib/storage";
import {
  APARIENCIA_ARCHIVO,
  aparienciaInicial,
  aparienciaSchema,
  cargarApariencia,
  type Apariencia,
} from "@/lib/apariencia";

export default function AdminApariencia() {
  const router = useRouter();
  const [apariencia, setApariencia] = useState<Apariencia>(aparienciaInicial);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fase, setFase] = useState<"imagen" | "datos" | null>(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    let activo = true;
    cargarApariencia()
      .then((datos) => {
        if (activo) {
          setApariencia(datos);
          setCargando(false);
        }
      })
      .catch(() => {
        if (activo)
          setError(
            "No se pudo cargar la apariencia. Recarga la página para intentarlo otra vez.",
          );
      });
    return () => {
      activo = false;
    };
  }, []);

  async function guardar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMensaje("");
    setFase(archivo ? "imagen" : "datos");
    try {
      let portadaUrl = apariencia.portada_url;
      if (archivo) {
        const resultado = await subirImagen(archivo, "productos", "portadas");
        if (resultado.error || !resultado.url)
          throw new Error(resultado.error ?? "No se pudo subir la portada.");
        portadaUrl = resultado.url;
        setApariencia((actual) => ({ ...actual, portada_url: portadaUrl }));
        setArchivo(null);
      }
      setFase("datos");
      const datos = aparienciaSchema.parse({
        ...apariencia,
        portada_url: portadaUrl,
      });
      const { error: storageError } = await createClient()
        .storage.from("productos")
        .upload(
          APARIENCIA_ARCHIVO,
          new Blob([JSON.stringify(datos)], { type: "application/json" }),
          { upsert: true, contentType: "application/json", cacheControl: "0" },
        );
      if (storageError) throw new Error(storageError.message);
      setMensaje("Apariencia guardada. Ya puedes verla en la página.");
      router.refresh();
    } catch (causa) {
      setError(
        causa instanceof Error
          ? causa.message
          : "No se pudo guardar la apariencia.",
      );
    } finally {
      setFase(null);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl text-ink mb-2">Apariencia</h1>
      <p className="text-sm text-muted mb-6">
        Cambia la portada y los colores del fondo de la página.
      </p>
      {cargando && error && (
        <p role="alert" className="text-sm text-danger mb-4">
          {error}
        </p>
      )}
      {cargando ? (
        <p role="status" className="text-sm text-muted">
          {error ? "Recarga para continuar." : "Cargando apariencia…"}
        </p>
      ) : (
        <>
          <AdminForm
            onSubmit={guardar}
            enviando={fase !== null}
            textoEspera={fase === "imagen" ? "Subiendo portada…" : "Guardando apariencia…"}
            textoBoton="Guardar apariencia"
            error={error}
          >
            <ImageField
              etiqueta="Imagen de portada"
              imagenActual={apariencia.portada_url}
              archivo={archivo}
              onArchivo={(nuevoArchivo) => {
                setArchivo(nuevoArchivo);
                setError("");
                setMensaje("");
              }}
              portada
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="fondo-inicio"
                  className="block text-sm font-medium mb-2"
                >
                  Color superior
                </label>
                <input
                  id="fondo-inicio"
                  type="color"
                  value={apariencia.fondo_inicio}
                  onChange={(e) =>
                    setApariencia({
                      ...apariencia,
                      fondo_inicio: e.target.value,
                    })
                  }
                  className="field h-11 cursor-pointer"
                />
              </div>
              <div>
                <label
                  htmlFor="fondo-fin"
                  className="block text-sm font-medium mb-2"
                >
                  Color inferior
                </label>
                <input
                  id="fondo-fin"
                  type="color"
                  value={apariencia.fondo_fin}
                  onChange={(e) =>
                    setApariencia({ ...apariencia, fondo_fin: e.target.value })
                  }
                  className="field h-11 cursor-pointer"
                />
              </div>
            </div>
            <div
              role="img"
              aria-label="Vista previa del degradado"
              className="h-28 rounded-lg border border-hairline"
              style={{
                background: `radial-gradient(125% 125% at 50% 10%, ${apariencia.fondo_inicio} 40%, ${apariencia.fondo_fin} 100%)`,
              }}
            />
            <button
              type="button"
              className="text-sm underline text-accent self-start"
              onClick={() =>
                setApariencia({
                  ...apariencia,
                  fondo_inicio: aparienciaInicial.fondo_inicio,
                  fondo_fin: aparienciaInicial.fondo_fin,
                })
              }
            >
              Usar el degradado original
            </button>
          </AdminForm>
          {mensaje && (
            <p role="status" className="mt-4 text-sm text-accent">
              {mensaje}
            </p>
          )}
        </>
      )}
    </div>
  );
}
