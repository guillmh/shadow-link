import { createClient } from "@/lib/supabase/client";

/**
 * Tipos MIME de imagen admitidos y la extensión con la que se guardan.
 * La extensión se deriva SIEMPRE del tipo validado, nunca del nombre del archivo.
 */
const EXTENSIONES_POR_TIPO: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Tamaño máximo admitido: 5 MB. */
const LIMITE_BYTES = 5 * 1024 * 1024;

export async function subirImagen(
  archivo: File,
  bucket: string,
  carpeta: string = "general",
): Promise<{ url: string | null; error: string | null }> {
  const extension = EXTENSIONES_POR_TIPO[archivo.type];

  if (!extension) {
    return {
      url: null,
      error: "Formato de imagen no admitido. Usa un archivo PNG, JPEG, WebP o GIF.",
    };
  }

  if (archivo.size > LIMITE_BYTES) {
    return {
      url: null,
      error: "La imagen supera el tamaño máximo de 5 MB.",
    };
  }

  const supabase = createClient();
  const nombreArchivo = `${carpeta}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(nombreArchivo, archivo);

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(nombreArchivo);
  return { url: data.publicUrl, error: null };
}
