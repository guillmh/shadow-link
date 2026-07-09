"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ULTIMO_VIDEO_URL } from "@/app/data/config";

function extraerVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function LatestVideo() {
  const [reproduciendo, setReproduciendo] = useState(false);
  const videoId = extraerVideoId(ULTIMO_VIDEO_URL);

  if (!videoId) return null;

  return (
    <section className="px-4 py-4">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
        [ YouTube: Último video ]
      </span>

      <div className="mt-2 relative aspect-video w-full border border-hairline overflow-hidden bg-ink">
        {reproduciendo ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="Último video"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setReproduciendo(true)}
            className="group relative w-full h-full"
            aria-label="Reproducir video"
          >
            <img
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt="Miniatura del último video"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Play size={22} className="text-ink fill-ink ml-0.5" />
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
