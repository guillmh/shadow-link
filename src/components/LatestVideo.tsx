"use client";
import Skeleton from "./Skeleton";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

function extraerVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function LatestVideo({ videoUrl }: { videoUrl: string | null }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const videoId = videoUrl ? extraerVideoId(videoUrl) : null;

  if (!videoId) {
    return (
      <section className="px-4 py-4">
        <span className="label-mono">
          [ Último video ]
        </span>
        <Skeleton className="mt-2 aspect-video w-full rounded-lg" />
      </section>
    );
  }

  return (
    <section className="px-4 py-4">
      <span className="label-mono">
        [ Último video ]
      </span>

      <div className="mt-2 relative aspect-video w-full rounded-lg overflow-hidden border border-white/65 bg-ink shadow-md">
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
            className="group relative w-full h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
            aria-label="Reproducir video"
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
              alt="Miniatura del último video"
              fill
              sizes="(max-width: 672px) 100vw, 672px"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-md transition-transform duration-[var(--dur-base)] ease-[var(--ease-spring)] group-hover:scale-105">
                <Play size={22} className="text-ink fill-ink ml-0.5" />
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
