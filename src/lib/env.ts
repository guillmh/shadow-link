import { z } from "zod";

/**
 * Validación de variables de entorno públicas de Supabase.
 *
 * Solo se validan variables `NEXT_PUBLIC_*` porque este módulo también se
 * importa desde componentes de cliente (donde Next.js sustituye estas
 * variables en build time).
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("Debe ser una URL válida (https://...supabase.co)"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "No puede estar vacía"),
});

const resultado = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!resultado.success) {
  const detalle = resultado.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(
    `Configuración de entorno de Supabase inválida:\n${detalle}\n` +
      "Revisa tu archivo .env.local.",
  );
}

export const env = resultado.data;

export type Env = typeof env;
