import { z } from "zod";

export const videoSchema = z.object({
  ultimo_video_url: z
    .string()
    .url("Debe ser un link válido")
    .refine((url) => /(?:v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url), {
      message: "Debe ser un link de YouTube válido",
    }),
});

export type VideoFormValues = z.infer<typeof videoSchema>;
