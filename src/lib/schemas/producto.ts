import { z } from "zod";

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  categoria: z.string().min(1, "La categoría es obligatoria"),
  link: z.string().url("Debe ser un link válido (https://...)"),
});

export type ProductoFormValues = z.infer<typeof productoSchema>;
