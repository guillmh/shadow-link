import { z } from "zod";

export const sponsorSchema = z
  .object({
    marca: z.string().min(1, "La marca es obligatoria"),
    descripcion: z.string().optional(),
    link: z.string().url("Debe ser un link válido (https://...)"),
    fecha_inicio: z.string().min(1, "La fecha de inicio es obligatoria"),
    fecha_fin: z.string().min(1, "La fecha de fin es obligatoria"),
  })
  .refine((datos) => new Date(datos.fecha_fin) > new Date(datos.fecha_inicio), {
    message: "La fecha de fin debe ser posterior a la de inicio",
    path: ["fecha_fin"],
  });

export type SponsorFormValues = z.infer<typeof sponsorSchema>;
