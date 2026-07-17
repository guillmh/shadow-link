import { createClient } from "@/lib/supabase/client";

export async function subirImagen(
  archivo: File,
  bucket: string,
  carpeta: string = "general",
): Promise<{ url: string | null; error: string | null }> {
  const supabase = createClient();
  const extension = archivo.name.split(".").pop();
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
