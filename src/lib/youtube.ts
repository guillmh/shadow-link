export const canalYouTube = "https://www.youtube.com/@shadowez9";

export type VideoYouTube = {
  id: string;
  titulo: string;
  avatarUrl?: string;
  vistas?: string;
  antiguedad?: string;
};

export const patronIdVideo = /^[a-zA-Z0-9_-]{11}$/;

export function extraerVideoId(valor: string): string | null {
  try {
    const url = new URL(valor);
    const host = url.hostname.replace(/^www\./, "");
    if (!["youtube.com", "m.youtube.com", "youtu.be"].includes(host))
      return null;
    const partes = url.pathname.split("/");
    const id =
      host === "youtu.be"
        ? partes[1]
        : (url.searchParams.get("v") ??
          (["shorts", "embed", "live"].includes(partes[1]) ? partes[2] : null));
    return id && patronIdVideo.test(id) ? id : null;
  } catch {
    return null;
  }
}
