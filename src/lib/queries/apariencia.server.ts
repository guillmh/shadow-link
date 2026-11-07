import "server-only";
import { connection } from "next/server";
import { aparienciaInicial, cargarApariencia } from "@/lib/apariencia";
import { logger } from "@/lib/logger";

export async function fetchApariencia() {
  await connection();
  try {
    return await cargarApariencia();
  } catch (error) {
    logger.error("Error cargando apariencia", error);
    return aparienciaInicial;
  }
}
