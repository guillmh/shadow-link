import { z } from "zod";
import { env } from "@/lib/env";

const storageBase = `${env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/+$/, "")}/storage/v1/object/public/productos/`;

export const aparienciaSchema = z.object({
  portada_url: z
    .string()
    .refine(
      (valor) => valor === "/portada.jpg" || valor.startsWith(storageBase),
      "Usa una imagen subida al almacenamiento del sitio.",
    ),
  fondo_inicio: z.string().regex(/^#[0-9a-f]{6}$/i),
  fondo_fin: z.string().regex(/^#[0-9a-f]{6}$/i),
});

export type Apariencia = z.infer<typeof aparienciaSchema>;
export const APARIENCIA_ARCHIVO = "configuracion/apariencia.json";
export const aparienciaInicial: Apariencia = {
  portada_url: "/portada.jpg",
  fondo_inicio: "#000000",
  fondo_fin: "#0a52cb",
};

export async function cargarApariencia(): Promise<Apariencia> {
  const respuesta = await fetch(`${storageBase}${APARIENCIA_ARCHIVO}`, {
    cache: "no-store",
  });
  if (respuesta.status === 404) return aparienciaInicial;
  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);
    if (error?.statusCode === "404" || error?.statusCode === 404)
      return aparienciaInicial;
    throw new Error("No se pudo cargar la apariencia guardada.");
  }
  return aparienciaSchema.parse(await respuesta.json());
}
