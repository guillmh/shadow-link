import "server-only";

import { connection } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { fetchUltimoVideoUrl } from "@/lib/queries/configuracion.server";
import {
  canalYouTube,
  extraerVideoId,
  patronIdVideo,
  type VideoYouTube,
} from "@/lib/youtube";

const datosCanal = z.object({
  contents: z.object({
    twoColumnBrowseResultsRenderer: z.object({
      tabs: z.array(z.object({ tabRenderer: z.unknown().optional() })),
    }),
  }),
  metadata: z
    .object({
      channelMetadataRenderer: z
        .object({
          avatar: z
            .object({ thumbnails: z.array(z.object({ url: z.string() })) })
            .optional(),
        })
        .optional(),
    })
    .optional(),
});

const videosCanal = z.object({
  selected: z.literal(true),
  content: z.object({
    richGridRenderer: z.object({ contents: z.array(z.unknown()) }),
  }),
});

const elementoVideo = z.object({
  richItemRenderer: z.object({ content: z.record(z.string(), z.unknown()) }),
});

const metadato = z.object({
  accessibilityLabel: z.string().optional(),
  text: z.object({ content: z.string() }).optional(),
});

const videoActual = z.object({
  contentType: z.literal("LOCKUP_CONTENT_TYPE_VIDEO"),
  contentId: z.string().regex(patronIdVideo),
  metadata: z.object({
    lockupMetadataViewModel: z.object({
      title: z.object({ content: z.string().trim().min(1) }),
      metadata: z
        .object({
          contentMetadataViewModel: z.object({
            metadataRows: z.array(
              z.object({ metadataParts: z.array(metadato) }),
            ),
          }),
        })
        .optional(),
    }),
  }),
});

const textoYouTube = z.union([
  z.object({ simpleText: z.string() }).transform((valor) => valor.simpleText),
  z
    .object({ runs: z.array(z.object({ text: z.string() })) })
    .transform((valor) => valor.runs.map(({ text }) => text).join("")),
]);

const videoCompacto = z.object({
  videoId: z.string().regex(patronIdVideo),
  title: textoYouTube,
  viewCountText: textoYouTube.optional(),
  publishedTimeText: textoYouTube.optional(),
});

function leerDatosCanal(html: string): unknown {
  const script = html.match(
    /\bvar ytInitialData\s*=\s*([\s\S]*?)\s*;\s*<\/script>/,
  )?.[1];
  if (!script)
    throw new Error("No se encontraron los datos públicos del canal.");
  const json = script.startsWith("'")
    ? script
        .slice(1, -1)
        .replace(/\\x([\da-f]{2})/gi, (_, hex: string) =>
          String.fromCharCode(Number.parseInt(hex, 16)),
        )
    : script;
  return JSON.parse(json);
}

function leerVideo(elemento: unknown): VideoYouTube | null {
  const item = elementoVideo.safeParse(elemento);
  if (!item.success) return null;
  const contenido = item.data.richItemRenderer.content;
  const actual = videoActual.safeParse(contenido.lockupViewModel);
  if (actual.success) {
    const metadata = actual.data.metadata.lockupMetadataViewModel;
    const partes =
      metadata.metadata?.contentMetadataViewModel.metadataRows.flatMap((fila) =>
        fila.metadataParts.map(
          (parte) => parte.accessibilityLabel ?? parte.text?.content ?? "",
        ),
      ) ?? [];
    return {
      id: actual.data.contentId,
      titulo: metadata.title.content,
      vistas: partes.find((parte) =>
        /\b(vistas?|visualizaciones)\b/i.test(parte),
      ),
      antiguedad: partes.find((parte) => /^hace\b/i.test(parte)),
    };
  }

  const compacto = videoCompacto.safeParse(
    contenido.compactVideoRenderer ?? contenido.videoRenderer,
  );
  if (!compacto.success) return null;
  return {
    id: compacto.data.videoId,
    titulo: compacto.data.title,
    vistas: compacto.data.viewCountText?.replace(/visualizaciones/i, "vistas"),
    antiguedad: compacto.data.publishedTimeText,
  };
}

export async function fetchUltimoVideoYouTube(): Promise<VideoYouTube | null> {
  await connection();
  try {
    const respuesta = await fetch(`${canalYouTube}/videos?hl=es&gl=MX`, {
      headers: { "Accept-Language": "es-MX,es;q=0.9" },
      next: { revalidate: 60 * 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!respuesta.ok)
      throw new Error(`YouTube respondió con HTTP ${respuesta.status}.`);

    const datos = datosCanal.parse(leerDatosCanal(await respuesta.text()));
    const pestana = datos.contents.twoColumnBrowseResultsRenderer.tabs
      .map(({ tabRenderer }) => videosCanal.safeParse(tabRenderer))
      .find((tab) => tab.success);
    if (!pestana?.success)
      throw new Error("No se encontró la pestaña de videos.");

    const avatarUrl =
      datos.metadata?.channelMetadataRenderer?.avatar?.thumbnails[0]?.url;
    for (const item of pestana.data.content.richGridRenderer.contents) {
      const video = leerVideo(item);
      if (video) {
        return {
          ...video,
          avatarUrl: avatarUrl?.startsWith("https://yt3.googleusercontent.com/")
            ? avatarUrl
            : undefined,
        };
      }
    }
    throw new Error("El canal no devolvió un video disponible.");
  } catch (error) {
    logger.warn("No se pudo actualizar el video de YouTube", error);
  }

  const respaldo = await fetchUltimoVideoUrl();
  const id = respaldo && extraerVideoId(respaldo);
  return id ? { id, titulo: "Video de ShadowEZ" } : null;
}
