"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { canalYouTube, type VideoYouTube } from "@/lib/youtube";

export default function LatestVideo({ video }: { video: VideoYouTube }) {
  const [reproduciendo, setReproduciendo] = useState(false);
  const detalles = [video.vistas, video.antiguedad].filter(Boolean).join(" · ");

  return (
    <section className="creator-video" aria-labelledby="latest-video-title">
      <div className="creator-video-window">
        {reproduciendo ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.titulo}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setReproduciendo(true)}
            className="group relative h-full w-full cursor-pointer"
            aria-label={`Reproducir: ${video.titulo}`}
          >
            <Image
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(max-width: 672px) calc(100vw - 32px), 640px"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/15 transition-colors group-hover:bg-black/25">
              <span className="creator-play">
                <Play
                  size={23}
                  aria-hidden="true"
                  className="ml-0.5 fill-current"
                />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="creator-video-meta">
        <a
          href={canalYouTube}
          target="_blank"
          rel="noopener noreferrer"
          className="creator-video-avatar"
          aria-label="Canal de ShadowEZ en YouTube"
        >
          <Image
            src={video.avatarUrl ?? "/logo.webp"}
            alt=""
            width={40}
            height={40}
          />
        </a>
        <div className="min-w-0">
          <h2 id="latest-video-title">
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {video.titulo}
            </a>
          </h2>
          <p>ShadowEZ</p>
          {detalles && <p>{detalles}</p>}
        </div>
      </div>
    </section>
  );
}
